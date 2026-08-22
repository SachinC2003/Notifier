import type { NextFunction, Request, Response } from "express";
import {
  NotificationType,
  type CreateNotificationInput,
} from "../dtos/notifier.dto";
import { AppError } from "../errors/app-error";

const e164PhonePattern = /^\+[1-9]\d{7,14}$/;
const eventKeyPattern = /^[A-Za-z0-9._-]{3,100}$/;

export const validateCreateNotification = (
  req: Request<unknown, unknown, CreateNotificationInput>,
  _res: Response,
  next: NextFunction,
) => {
  const { eventKey, recipient, data, channel } = req.body ?? {};

  if (typeof eventKey !== "string" || !eventKeyPattern.test(eventKey.trim())) {
    return next(new AppError("eventKey has an invalid format", 400));
  }

  if (
    typeof recipient !== "string" ||
    !e164PhonePattern.test(recipient.trim())
  ) {
    return next(
      new AppError(
        "recipient must be an E.164 phone number, for example +14155552671",
        400,
      ),
    );
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return next(new AppError("data must be a JSON object", 400));
  }

  try {
    JSON.stringify(data);
  } catch {
    return next(new AppError("data must be JSON serializable", 400));
  }

  req.body = {
    eventKey: eventKey.trim(),
    recipient: recipient.trim(),
    data,
    channel,
  };

  return next();
};
