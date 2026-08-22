import { Router } from "express";
import { createEventController } from "../controllers/event/create-event.controller";
import { deleteEventController } from "../controllers/event/delete-event.controller";
import { getEventController } from "../controllers/event/get-event.controller";
import { listEventsController } from "../controllers/event/list-events.controller";
import { updateEventController } from "../controllers/event/update-event.controller";
import { authenticate } from "../middlewares/auth.middleware";
import {
  validateCreateEvent,
  validateEventId,
  validateUpdateEvent,
} from "../middlewares/validate-event.middleware";

const eventRouter = Router();
eventRouter.use(authenticate);
eventRouter.post("/", validateCreateEvent, createEventController);
eventRouter.get("/", listEventsController);
eventRouter.get("/:eventId", validateEventId, getEventController);
eventRouter.patch(
  "/:eventId",
  validateEventId,
  validateUpdateEvent,
  updateEventController,
);
eventRouter.delete("/:eventId", validateEventId, deleteEventController);
export default eventRouter;
