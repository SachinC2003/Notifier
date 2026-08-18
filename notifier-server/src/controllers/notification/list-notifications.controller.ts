import type { NextFunction, Request, Response } from "express";
import { listNotifications } from "../../bll/notification/notification.bll";

export const listNotificationsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await listNotifications(req.apiKey!.userId);
    return res.status(200).json({ data: notifications });
  } catch (error) {
    return next(error);
  }
};
