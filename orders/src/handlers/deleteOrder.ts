import { Request, Response } from "express";

export async function deleteOrder(req: Request, res: Response) {
  res.send("Delete order");
}
