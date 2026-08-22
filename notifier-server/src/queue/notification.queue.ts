import "dotenv/config";
import { Queue } from "bullmq";

export interface SmsJobData {
  notificationId: string;
}

const redisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

const defaultOptions = {
  attempts: 3,
  backoff: { type: "exponential", delay: 5000 },
  removeOnComplete: true,
};

// Distinct queues for separate handling
export const emailQueue = new Queue("EmailQueue", {
  connection: redisOptions,
  defaultJobOptions: defaultOptions,
});

export const smsQueue = new Queue<SmsJobData>("SMSQueue", {
  connection: redisOptions,
  defaultJobOptions: defaultOptions,
});

export const whatsappQueue = new Queue<SmsJobData>("WhatsAppQueue", {
  connection: redisOptions,
  defaultJobOptions: defaultOptions,
});
