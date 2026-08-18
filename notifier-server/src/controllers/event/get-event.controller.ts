import type { NextFunction, Request, Response } from "express";
import { getEvent } from "../../bll/event/event.bll";

export const getEventController = async (req: Request<{ eventId: string }>, res: Response, next: NextFunction) => {
  try { return res.status(200).json({ data: await getEvent(req.userId!, req.params.eventId) }); } catch (error) { return next(error); }
};
