/* 
The allTickets handler will be responsible for fetching all tickets from the database and returning them to the user.

1. Import the Request and Response types from express.
2. Define the allTickets handler function. This function will be an async function that takes a request and response object as arguments.
3. It would also take page and limit query parameters from the request object. These parameters will be used to paginate the tickets.
4. Fetch all tickets from the database using the Ticket model's find method. Use the skip and limit methods to paginate the results based on the page and limit query parameters.
5. Return the fetched tickets as a response to the user.

*/

import { Request, Response } from "express";
import { ApiResponse } from "@eractickets/ticketing-common";

import { Ticket } from "../models/ticket";

export async function allTickets(req: Request, res: Response) {
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
  const totalCount = await Ticket.countDocuments();

  // Fetch all tickets from the database
  const tickets = (await Ticket.find().skip(skip).limit(parsedLimit)).map(
    (ticket) => {
      return ticket.toJSON();
    }
  );

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / parsedLimit);

  return res.status(200).send(
    new ApiResponse({
      statusCode: 200,
      data: {
        tickets,
        page: parsedPage,
        limit: parsedLimit,
        totalPages,
      },
    })
  );
}
