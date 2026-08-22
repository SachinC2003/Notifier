import "dotenv/config";
import { Worker, type Job } from "bullmq";
import { prisma } from "../config/db"; // 🌟 IMPORT FIXED GLOBAL INSTANCE HERE
import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const whatsappAddress = (value: string, field: string) => {
  const address = value.trim();
  if (!address) throw new Error(`${field} is required for WhatsApp delivery.`);
  return address.startsWith("whatsapp:") ? address : `whatsapp:${address}`;
};

interface SmsJobData {
  notificationId: string;
}

const whatsappWorker = new Worker<SmsJobData>(
  "WhatsAppQueue",
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
      `📱 [Job #${job.id}] Processing Twilio WhatsApp message to ${notification.recipient}`,
    );

    await prisma.notification.update({
      where: { id: notificationId },
      data: { status: "PROCESSING" },
    });

    try {
      const twilioMessage = await twilioClient.messages.create({
        body: smsTextBody,
        from: whatsappAddress(
          process.env.TWILIO_WHATSAPP_FROM ?? "",
          "TWILIO_WHATSAPP_FROM",
        ),
        to: whatsappAddress(notification.recipient, "Recipient"),
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

      console.log(`✅ [Job #${job.id}] WhatsApp message delivered!`);
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
      if (job.attemptsMade + 1 >= (job.opts.attempts ?? 1)) {
        await prisma.notification.update({
          where: { id: notificationId },
          data: { status: "FAILED", failedAt: new Date() },
        });
      }
      throw error;
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
    },
    concurrency: 2,
  },
);

console.log(
  "⚙️ Worker background thread actively listening for new Redis streams...",
);

export { whatsappWorker };
