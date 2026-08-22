import type { NextFunction, Request, Response } from "express";
import { deleteAllNotifications } from "../../bll/notification/notification.bll";

export const deleteAllNotificationsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteAllNotifications(req.apiKey!.userId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
