// src/queue/sms.worker.ts
import { Worker, type Job } from "bullmq";
import { prisma } from "../config/db"; // 🌟 IMPORT FIXED GLOBAL INSTANCE HERE
import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

interface SmsJobData {
  notificationId: string;
}

const smsWorker = new Worker<SmsJobData>(
  "SMSQueue",
  async (job: Job<SmsJobData>) => {
    const { notificationId } = job.data;

    // The shared instance now queries using driver adapters flawlessly
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification)
      throw new Error(`Notification ${notificationId} missing.`);

    const payloadData = notification.payload as any;
    const smsTextBody = payloadData?.renderedBody;

    if (!smsTextBody) throw new Error(`No renderedBody for ${notificationId}`);

    console.log(
      `📱 [Job #${job.id}] Processing Twilio SMS to ${notification.recipient}`,
    );

    await prisma.notification.update({
      where: { id: notificationId },
      data: { status: "PROCESSING" },
    });

    try {
      const twilioMessage = await twilioClient.messages.create({
        body: smsTextBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: notification.recipient,
      });

      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: "SENT",
          provider: "TWILIO",
          sentAt: new Date(),
        },
      });

      await prisma.notificationLog.create({
        data: {
          notificationId,
          attemptNumber: job.attemptsMade + 1,
          response: { sid: twilioMessage.sid, status: twilioMessage.status },
        },
      });

      console.log(`✅ [Job #${job.id}] SMS text delivered!`);
      return { success: true, sid: twilioMessage.sid };
    } catch (error: any) {
      await prisma.notificationLog.create({
        data: {
          notificationId,
          attemptNumber: job.attemptsMade + 1,
          errorMessage: error.message || "Twilio failure",
          response: { code: error.code, status: error.status },
        },
      });
      throw error;
    }
  },
  {
    connection: { host: process.env.REDIS_HOST || "127.0.0.1", port: 6379 },
    concurrency: 2,
  },
);

console.log(
  "⚙️ Worker background thread actively listening for new Redis streams...",
);

export { smsWorker };
