import { Router } from "express";
import signin from "../controllers/auth/signin.controller";
import signup from "../controllers/auth/signup.controller";
import { createApiKeyController } from "../controllers/auth/api-key.controller";
import { validateSignIn } from "../middlewares/validate-signin.middleware";
import { validateSignUp } from "../middlewares/validate-signup.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/register", validateSignUp, signup);
authRouter.post("/login", validateSignIn, signin);
authRouter.post("/api-keys", authenticate, createApiKeyController);

export default authRouter;
