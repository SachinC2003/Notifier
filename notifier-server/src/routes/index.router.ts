import authRouter from "./auth.route";
import eventRouter from "./event.route";
import notificationRouter from "./notification.route";
import { Router } from "express";

const router = Router();

router.use("/auth", authRouter);
router.use("/events", eventRouter);
router.use("/notifications", notificationRouter);

export default router;
export { authRouter, eventRouter, notificationRouter };
