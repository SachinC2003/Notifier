import type { NextFunction, Request, Response } from "express";
import { getNotificationStatus } from "../../bll/notification/notification.bll";

export const getNotificationStatusController = async (req: Request<{ notificationId: string }>, res: Response, next: NextFunction) => {
  try {
    const status = await getNotificationStatus(req.apiKey!.userId, req.params.notificationId);
    return res.status(200).json({ data: status });
  } catch (error) {
    return next(error);
  }
};
