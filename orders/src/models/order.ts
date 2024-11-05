import mongoose, { Schema } from "mongoose";
import { OrderStatus } from "@eractickets/ticketing-common";
import { TicketDoc } from "./ticket";

const { Types } = Schema;

// 1. Define interface required to build a new order
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// 2. Define interface for properties an Order documennt has
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: TicketDoc;
  createdAt: string;
  updatedAt: string;
}

// 3. Define interface for Order Model
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new Schema(
  {
    userId: {
      type: Types.String,
      required: true,
    },
    status: {
      type: Types.String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Types.Date,
    },
    ticket: {
      type: Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

export const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
export { OrderStatus };
