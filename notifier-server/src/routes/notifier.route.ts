import { Router } from "express";
import {
  getNotifications,
  notifier,
} from "../controllers/notification/notifier.controller";

const notifierRouter = Router();

notifierRouter.post("/notify", notifier);
notifierRouter.get("/notifications", getNotifications);

export default notifierRouter;
