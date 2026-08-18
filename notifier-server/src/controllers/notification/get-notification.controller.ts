import type { NextFunction, Request, Response } from "express";
import { getNotification } from "../../bll/notification/notification.bll";

export const getNotificationController = async (req: Request<{ notificationId: string }>, res: Response, next: NextFunction) => {
  try {
    const notification = await getNotification(req.apiKey!.userId, req.params.notificationId);
    return res.status(200).json({ data: notification });
  } catch (error) {
    return next(error);
  }
};
