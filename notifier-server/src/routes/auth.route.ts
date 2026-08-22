import { Router } from "express";
import signin from "../controllers/auth/signin.controller";
import signup from "../controllers/auth/signup.controller";
import {
  createApiKeyController,
  listApiKeysController,
  revokeApiKeyController,
} from "../controllers/auth/api-key.controller";
import { validateSignIn } from "../middlewares/validate-signin.middleware";
import { validateSignUp } from "../middlewares/validate-signup.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { changePasswordController } from "../controllers/auth/password.controller";

const authRouter = Router();

authRouter.post("/register", validateSignUp, signup);
authRouter.post("/login", validateSignIn, signin);
authRouter.post("/api-keys", authenticate, createApiKeyController);
authRouter.get("/api-keys", authenticate, listApiKeysController);
authRouter.delete("/api-keys/:apiKeyId", authenticate, revokeApiKeyController);
authRouter.patch("/password", authenticate, changePasswordController);

export default authRouter;
