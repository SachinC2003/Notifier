// src/queue/email.worker.ts
import { prisma } from "../config/db";
import { Worker, Job } from "bullmq";

const redisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

export const emailWorker = new Worker(
  "EmailQueue",
  async (job: Job) => {
    const { notificationId } = job.data;

    // Get the notification details from the database using Prisma
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification)
      throw new Error(`Notification ${notificationId} missing.`);

    const payloadData = notification.payload as any;
    const emailSubject = payloadData?.renderedSubject;
    const emailBody = payloadData?.renderedBody;

    if (!emailSubject || !emailBody)
      throw new Error(
        `No renderedSubject or renderedBody for ${notificationId}`,
      );

    console.log(
      `📧 [Job #${job.id}] Processing email to ${notification.recipient}`,
    );

    await prisma.notification.update({
      where: { id: notificationId },
      data: { status: "PROCESSING" },
    });

    try {
      // Simulate sending email (replace this with actual email sending logic)
      const sendEmail = async (to: string, subject: string, body: string) => {};

      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: "SENT",
          provider: "EMAIL_PROVIDER",
          sentAt: new Date(),
        },
      });

      await prisma.notificationLog.create({
        data: {
          notificationId,
          attemptNumber: job.attemptsMade + 1,
          response: { message: "Email sent successfully" },
        },
      });

      console.log(`✅ [Job #${job.id}] Email sent successfully!`);
      return { success: true };
    } catch (error: any) {
      await prisma.notificationLog.create({
        data: {
          notificationId,
          attemptNumber: job.attemptsMade + 1,
          errorMessage: error.message || "Email sending failure",
          response: { code: error.code, status: error.status },
        },
      });
      throw error;
    }
  },
  {
    connection: redisOptions,
    concurrency: 5, // Number of concurrent jobs to process
  },
);
