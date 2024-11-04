import { Request, Response } from "express";

export async function getOrderDetails(req: Request, res: Response) {
  res.send("Order Detals");
}
