import type { NextFunction, Request, Response } from "express";
import { sendNotification } from "../../bll/notification/notification.bll";
import type { CreateNotificationInput } from "../../dtos/notifier.dto";

export const sendNotificationController = async (
  req: Request<unknown, unknown, CreateNotificationInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const notification = await sendNotification(req.apiKey!.userId, req.body);

    return res.status(202).json({
      message: "Notification accepted and is pending delivery",
      data: notification,
    });
  } catch (error) {
    return next(error);
  }
};
