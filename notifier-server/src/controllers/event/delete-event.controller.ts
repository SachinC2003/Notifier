import type { NextFunction, Request, Response } from "express";
import { deleteEvent } from "../../bll/event/event.bll";

export const deleteEventController = async (req: Request<{ eventId: string }>, res: Response, next: NextFunction) => {
  try { await deleteEvent(req.userId!, req.params.eventId); return res.status(204).send(); } catch (error) { return next(error); }
};
