import type { NextFunction, Request, Response } from "express";
import { updateEvent } from "../../bll/event/event.bll";
import type { UpdateEventInput } from "../../dtos/event.dto";

export const updateEventController = async (
  req: Request<{ eventId: string }, unknown, UpdateEventInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const event = await updateEvent(req.userId!, req.params.eventId, req.body);
    return res.status(200).json({ message: "Event updated", data: event });
  } catch (error) {
    return next(error);
  }
};
