import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import type { CreateEventInput, UpdateEventInput } from "../../dtos/event.dto";
import { AppError } from "../../errors/app-error";
import { assertActiveUser } from "../auth-bll/auth-user.bll";

const eventSelect = {
  id: true,
  eventKey: true,
  name: true,
  description: true,
  channel: true,
  subject: true,
  body: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.EventSelect;

const throwDuplicateKeyIfNeeded = (error: unknown): never => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new AppError("An event with this eventKey already exists", 409);
  }

  throw error;
};

const getOwnedEventOrThrow = async (userId: string, eventId: string) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      userId,
    },
    select: eventSelect,
  });

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  return event;
};

const assertEventKeyAvailable = async (
  userId: string,
  eventKey: string,
  eventId?: string,
) => {
  const existingEvent = await prisma.event.findUnique({
    where: {
      userId_eventKey: {
        userId,
        eventKey,
      },
    },
    select: { id: true },
  });

  if (existingEvent && existingEvent.id !== eventId) {
    throw new AppError("An event with this eventKey already exists", 409);
  }
};

export const createEvent = async (userId: string, input: CreateEventInput) => {
  await assertActiveUser(userId);
  await assertEventKeyAvailable(userId, input.eventKey);

  try {
    const event = await prisma.event.create({
      data: {
        ...input,
        userId,
      },
      select: eventSelect,
    });

    return event;
  } catch (error) {
    return throwDuplicateKeyIfNeeded(error);
  }
};

export const listEvents = async (userId: string) => {
  await assertActiveUser(userId);

  const events = await prisma.event.findMany({
    where: { userId },
    select: eventSelect,
    orderBy: { createdAt: "desc" },
  });

  return events;
};

export const getEvent = async (userId: string, eventId: string) => {
  await assertActiveUser(userId);
  return getOwnedEventOrThrow(userId, eventId);
};

export const updateEvent = async (
  userId: string,
  eventId: string,
  input: UpdateEventInput,
) => {
  await assertActiveUser(userId);

  if (Object.keys(input).length === 0) {
    throw new AppError("Provide one or more fields to update", 400);
  }

  const currentEvent = await getOwnedEventOrThrow(userId, eventId);

  if (input.eventKey && input.eventKey !== currentEvent.eventKey) {
    await assertEventKeyAvailable(userId, input.eventKey, eventId);
  }

  try {
    const event = await prisma.event.update({
      where: { id: eventId },
      data: input,
      select: eventSelect,
    });

    return event;
  } catch (error) {
    return throwDuplicateKeyIfNeeded(error);
  }
};

export const deleteEvent = async (userId: string, eventId: string) => {
  await assertActiveUser(userId);
  await getOwnedEventOrThrow(userId, eventId);

  const notificationCount = await prisma.notification.count({
    where: { eventId },
  });

  if (notificationCount > 0) {
    throw new AppError(
      "This event cannot be deleted because it has notifications. Deactivate it instead.",
      409,
    );
  }

  await prisma.event.delete({
    where: { id: eventId },
  });
};
