/* 
The allOrders handler will be responsible for fetching all orders from the database and returning them to the user.

1. Import the Request and Response types from express.
2. Define the allOrders handler function. This function will be an async function that takes a request and response object as arguments.
3. It would also take page and limit query parameters from the request object. These parameters will be used to paginate the orders.
4. Fetch all orders from the database using the Order model's find method. CurrentUser and ticketId are the filters. Use the skip and limit methods to paginate the results based on the page and limit query parameters.
5. Return the fetched orders as a response to the user.

*/

import { Request, Response } from "express";
import { ApiResponse } from "@eractickets/ticketing-common";

import { Order } from "../models/order";

export async function getAllOrders(req: Request, res: Response) {
  const currentUser = req.currentUser;

  let page = "1";
  let limit = "10";
  // Extract page and limit query parameters from the request
  const { page: incomingPage, limit: incomingLimit } = req.query;

  if (incomingPage && typeof incomingPage === "string") {
    page = incomingPage;
  }

  if (incomingLimit && typeof incomingLimit === "string") {
    limit = incomingLimit;
  }
  // Parse page and limit as integers
  let parsedPage = parseInt(page);
  let parsedLimit = parseInt(limit);

  // If page or limit are NaN, set them to default values
  if (isNaN(parsedPage) || parsedPage < 1) {
    parsedPage = 1;
  }

  if (isNaN(parsedLimit) || parsedLimit < 1) {
    parsedLimit = 10;
  }

  // Calculate the number of documents to skip
  const skip = (parsedPage - 1) * parsedLimit;

  // Fetch total count of tickets from the database
  const totalCount = await Order.countDocuments();

  // Fetch all tickets from the database
  const orders = (
    await Order.find({ userId: currentUser!.id })
      .skip(skip)
      .populate("ticket")
      .limit(parsedLimit)
  ).map((order) => {
    return order.toJSON();
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / parsedLimit);

  return res.status(200).send(
    new ApiResponse({
      statusCode: 200,
      data: {
        orders,
        page: parsedPage,
        limit: parsedLimit,
        totalPages,
      },
    })
  );
}
