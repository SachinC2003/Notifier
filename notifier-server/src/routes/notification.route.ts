import { Router } from "express";
import { getNotificationController } from "../controllers/notification/get-notification.controller";
import { listNotificationsController } from "../controllers/notification/list-notifications.controller";
import { getNotificationStatusController } from "../controllers/notification/notification-status.controller";
import { sendNotificationController } from "../controllers/notification/send-notification.controller";
import { authenticateApiKey } from "../middlewares/api-key.middleware";
import { validateCreateNotification } from "../middlewares/validate-notification.middleware";

const notificationRouter = Router();
notificationRouter.use(authenticateApiKey);
notificationRouter.post("/", authenticateApiKey, validateCreateNotification, sendNotificationController);
notificationRouter.get("/", listNotificationsController);
notificationRouter.get("/:notificationId", getNotificationController);
notificationRouter.get("/:notificationId/status", getNotificationStatusController);
export default notificationRouter;
