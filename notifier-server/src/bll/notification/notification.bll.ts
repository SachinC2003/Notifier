import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import { NotificationType, type CreateNotificationInput } from "../../dtos/notifier.dto";
import { AppError } from "../../errors/app-error";
import { assertActiveUser } from "../auth-bll/auth-user.bll";
import { smsQueue } from "../../queue/notification.queue";


const notificationSelect = {
  id: true,
  channel: true,
  recipient: true,
  status: true,
  provider: true,
  jobId: true,
  payload: true,
  sentAt: true,
  failedAt: true,
  createdAt: true,
  updatedAt: true,
  event: {
    select: {
      id: true,
      eventKey: true,
      name: true,
    },
  },
  logs: {
    select: {
      id: true,
      attemptNumber: true,
      response: true,
      errorMessage: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  },
} satisfies Prisma.NotificationSelect;

const resolveValue = (data: Record<string, unknown>, path: string): unknown => {
  return path.split(".").reduce<unknown>((currentValue, key) => {
    if (!currentValue || typeof currentValue !== "object" || Array.isArray(currentValue)) {
      return undefined;
    }

    return (currentValue as Record<string, unknown>)[key];
  }, data);
};

const renderTemplate = (template: string, data: Record<string, unknown>) => {
  return template.replace(/{{\s*([A-Za-z0-9_.]+)\s*}}/g, (_placeholder, variableName: string) => {
    const value = resolveValue(data, variableName);

    if (value === undefined || value === null) {
      throw new AppError(`Missing template variable: ${variableName}`, 400);
    }

    return typeof value === "object" ? JSON.stringify(value) : String(value);
  });
};

const getOwnedNotificationOrThrow = async (userId: string, notificationId: string) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
    select: notificationSelect,
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  return notification;
};

export const sendNotification = async (userId: string, input: CreateNotificationInput) => {
  await assertActiveUser(userId);

  if (input.channel.length !== 1 || input.channel[0] !== NotificationType.SMS) {
    throw new AppError("Only the SMS channel is supported currently", 400);
  }

  const event = await prisma.event.findUnique({
    where: {
      userId_eventKey: {
        userId,
        eventKey: input.eventKey,
      },
    },
    select: {
      id: true,
      subject: true,
      body: true,
      isActive: true,
    },
  });
  if (!event) {
    throw new AppError("No event exists for this eventKey", 404);
  }

  if (!event.isActive) {
    throw new AppError("This event is inactive", 409);
  }

  const renderedSubject = renderTemplate(event.subject, input.data);
  const renderedBody = renderTemplate(event.body, input.data);

  const serializedData = JSON.parse(JSON.stringify(input.data)) as Prisma.InputJsonObject;

  const payload: Prisma.InputJsonValue = {
    data: serializedData,
    renderedSubject,
    renderedBody,
  };

  const notification = await prisma.$transaction(async (transaction) => {
    const createdNotification = await transaction.notification.create({
      data: {
        userId,
        eventId: event.id,
        recipient: input.recipient,
        status: "QUEUED",
        payload,
        channel: input.channel,
      },
      select: notificationSelect,
    });

    await transaction.notificationLog.create({
      data: {
        notificationId: createdNotification.id,
        attemptNumber: 0,
        response: { message: "Notification created and is waiting for delivery" },
      },
    });

    return createdNotification;
  });

  try {
    const job = await smsQueue.add(
      "send-sms",
      { notificationId: notification.id },
      { jobId: notification.id },
    );

    console.log(`smsQueue.count(): ${await smsQueue.count()}`);

    return await prisma.notification.update({
      where: { id: notification.id },
      data: { jobId: job.id ?? notification.id },
      select: notificationSelect,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unable to queue SMS notification";

    await prisma.notification.update({
      where: { id: notification.id },
      data: { status: "FAILED", failedAt: new Date() },
    });
    await prisma.notificationLog.create({
      data: {
        notificationId: notification.id,
        attemptNumber: 0,
        errorMessage,
      },
    });

    throw new AppError("Unable to queue SMS notification", 503);
  }
};

export const listNotifications = async (userId: string) => {
  await assertActiveUser(userId);

  const notifications = await prisma.notification.findMany({
    where: { userId },
    select: notificationSelect,
    orderBy: { createdAt: "desc" },
  });

  return notifications;
};

export const getNotification = async (userId: string, notificationId: string) => {
  await assertActiveUser(userId);
  return getOwnedNotificationOrThrow(userId, notificationId);
};

export const getNotificationStatus = async (userId: string, notificationId: string) => {
  await assertActiveUser(userId);

  const notification = await getOwnedNotificationOrThrow(userId, notificationId);

  return {
    id: notification.id,
    status: notification.status,
    sentAt: notification.sentAt,
    failedAt: notification.failedAt,
    logs: notification.logs,
  };
};
