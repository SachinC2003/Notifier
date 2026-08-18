import { PrismaClient } from "@prisma/client";
import { prisma } from "../config/db";
import { Worker, Job } from "bullmq";

const redisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",  
  port: parseInt(process.env.REDIS_PORT || "6379"),   
};

export const emailWorker = new Worker(
    "EmailQueue",
    async (job: Job) => {
        // Implement the logic to send email here
        console.log(`Processing email job with ID: ${job.id}`);
        const { notificationId } = job.data;

        // Get the notification details from the database using Prisma
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
            select: {
                recipientEmail: true,
                payload: true,
            },
        });

        if (!notification) {
            throw new Error("Notification not found");
        }

        const updatedNotification = await prisma.notification.update({
            where: { id: notificationId },
            data: { status: "PROCESSING" },
        });

        try{
            // Simulate email sending
        }catch(err){
            await prisma.notification.update({
                where: { id: notificationId },
                data: { status: "FAILED" },
            });

            await prisma.notificationLog.create({
                data: {
                    notificationId: notificationId,
                    attemptNumber: 1, // You can increment this based on your logic
                    status: "FAILED",
                    //errorMessage: err.message,
                },
            });
            throw err;
        }

        // Implement email sending logic here using the notification details
        console.log(`Sending email to: ${notification.recipientEmail}`);
    },{
        connection: redisOptions,
        concurrency: 5, // Number of concurrent jobs to process
    }
)