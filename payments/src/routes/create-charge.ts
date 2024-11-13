import { Router, Request, Response } from "express";
import {
  ApiResponse,
  BadRequestError,
  NotFoundError,
  OrderStatus,
  RequestValidationError,
  UnauthorizedError,
} from "@eractickets/ticketing-common";

import { Order } from "../models/order";
import { Payment } from "../models/payment";

import { stripe } from "../stripe";
import { createPaymentSchema } from "../lib/zod.utils";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { NatsWrapper } from "../lib/nats-wrapper.utils";

const router = Router();

router.post("/api/payments/charge", async (req: Request, res: Response) => {
  const currentUser = req.currentUser;
  // 1. Get the order Id and stripe token from the request body
  const { orderId: incomingOrderId, stripeToken: incomingStripeToken } =
    req.body;

  const validationResult = await createPaymentSchema.safeParseAsync({
    orderId: incomingOrderId,
    stripeToken: incomingStripeToken,
  });

  if (!validationResult.success) {
    throw new RequestValidationError(validationResult.error.errors);
  }

  const { orderId, stripeToken } = validationResult.data;

  // 2. Find the order in the database
  // Find the order that the payment is associated with and it must not be cancelled and user
  // must be the one to order
  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== currentUser!.id) {
    throw new UnauthorizedError();
  }

  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError("Cannot pay for an cancelled order");
  }

  const orderPrice = Number(order.price);

  if (isNaN(orderPrice)) {
    throw new BadRequestError("Invalid order price");
  }

  const charge = await stripe.charges.create({
    currency: "usd",
    amount: orderPrice * 100, // Convert to cents
    source: stripeToken,
  });

  if (charge.status !== "succeeded") {
    throw new BadRequestError("Payment failed");
  }

  // 3. Save the payment to the database
  const payment = Payment.build({
    orderId,
    stripeId: charge.id,
  });

  await payment.save();

  const nats = NatsWrapper.stan;
  await new PaymentCreatedPublisher(nats).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeId,
  });

  return res.status(201).send(
    new ApiResponse({
      statusCode: 201,
      data: payment,
    })
  );
});

export { router as createChargeRouter };
