import { Request, Response } from "express";

export async function getAllOrders(req: Request, res: Response) {
  res.send("All orders");
}
