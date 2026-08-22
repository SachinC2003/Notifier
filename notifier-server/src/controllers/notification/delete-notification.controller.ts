import type { NextFunction, Request, Response } from "express";
import { deleteNotification } from "../../bll/notification/notification.bll";

export const deleteNotificationController = async (
  req: Request<{ notificationId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteNotification(req.apiKey!.userId, req.params.notificationId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
