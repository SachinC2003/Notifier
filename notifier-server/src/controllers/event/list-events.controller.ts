import type { NextFunction, Request, Response } from "express";
import { listEvents } from "../../bll/event/event.bll";

export const listEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return res.status(200).json({ data: await listEvents(req.userId!) });
  } catch (error) {
    return next(error);
  }
};
