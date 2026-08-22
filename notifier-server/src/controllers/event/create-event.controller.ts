import type { NextFunction, Request, Response } from "express";
import { createEvent } from "../../bll/event/event.bll";
import type { CreateEventInput } from "../../dtos/event.dto";

export const createEventController = async (
  req: Request<unknown, unknown, CreateEventInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const event = await createEvent(req.userId!, req.body);
    return res.status(201).json({ message: "Event created", data: event });
  } catch (error) {
    return next(error);
  }
};
