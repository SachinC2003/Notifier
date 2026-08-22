import type { NextFunction, Request, Response } from "express";
import type { CreateEventInput, UpdateEventInput } from "../dtos/event.dto";
import { AppError } from "../errors/app-error";

const eventKeyPattern = /^[A-Za-z0-9._-]{3,100}$/;
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const requiredText = (
  value: unknown,
  field: string,
  maxLength: number,
): string => {
  if (
    typeof value !== "string" ||
    value.trim().length === 0 ||
    value.trim().length > maxLength
  )
    throw new AppError(
      `${field} is required and must be at most ${maxLength} characters`,
      400,
    );
  return value.trim();
};
const validChannels = (value: unknown): ("EMAIL" | "SMS" | "WHATSAPP")[] => {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some(
      (channel) =>
        channel !== "EMAIL" && channel !== "SMS" && channel !== "WHATSAPP",
    ) ||
    new Set(value).size !== value.length
  ) {
    throw new AppError(
      "channel must contain one or more unique values from EMAIL, SMS, or WHATSAPP",
      400,
    );
  }
  return value;
};

export const validateEventId = (
  req: Request<{ eventId: string }>,
  _res: Response,
  next: NextFunction,
) => {
  if (!uuidPattern.test(req.params.eventId))
    return next(new AppError("eventId must be a valid UUID", 400));
  return next();
};

export const validateCreateEvent = (
  req: Request<unknown, unknown, CreateEventInput>,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const { eventKey, name, subject, body, description, channel } =
      req.body ?? {};
    const normalizedKey = requiredText(eventKey, "eventKey", 100);
    if (!eventKeyPattern.test(normalizedKey))
      throw new AppError("eventKey has an invalid format", 400);
    if (
      description !== undefined &&
      (typeof description !== "string" || description.trim().length > 1_000)
    )
      throw new AppError("description must be text up to 1000 characters", 400);
    req.body = {
      eventKey: normalizedKey,
      name: requiredText(name, "name", 100),
      subject: requiredText(subject, "subject", 255),
      body: requiredText(body, "body", 50_000),
      channel: validChannels(channel),
      ...(description === undefined ? {} : { description: description.trim() }),
    };
    return next();
  } catch (error) {
    return next(error);
  }
};

export const validateUpdateEvent = (
  req: Request<unknown, unknown, UpdateEventInput>,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const input = req.body ?? {};
    const allowedKeys = [
      "eventKey",
      "name",
      "subject",
      "body",
      "description",
      "channel",
      "isActive",
    ];
    const keys = Object.keys(input);
    if (keys.length === 0 || keys.some((key) => !allowedKeys.includes(key)))
      throw new AppError(
        "Provide one or more valid event fields to update",
        400,
      );
    const update: UpdateEventInput = {};
    if (input.eventKey !== undefined) {
      const eventKey = requiredText(input.eventKey, "eventKey", 100);
      if (!eventKeyPattern.test(eventKey))
        throw new AppError("eventKey has an invalid format", 400);
      update.eventKey = eventKey;
    }
    if (input.name !== undefined)
      update.name = requiredText(input.name, "name", 100);
    if (input.subject !== undefined)
      update.subject = requiredText(input.subject, "subject", 255);
    if (input.body !== undefined)
      update.body = requiredText(input.body, "body", 50_000);
    if (input.channel !== undefined)
      update.channel = validChannels(input.channel);
    if (input.description !== undefined) {
      if (
        input.description !== null &&
        (typeof input.description !== "string" ||
          input.description.trim().length > 1_000)
      )
        throw new AppError(
          "description must be text up to 1000 characters or null",
          400,
        );
      update.description =
        input.description === null ? null : input.description.trim();
    }
    if (input.isActive !== undefined) {
      if (typeof input.isActive !== "boolean")
        throw new AppError("isActive must be a boolean", 400);
      update.isActive = input.isActive;
    }
    req.body = update;
    return next();
  } catch (error) {
    return next(error);
  }
};
