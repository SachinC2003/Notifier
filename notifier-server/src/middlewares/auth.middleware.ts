import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { AppError } from "../errors/app-error";
import { requireJwtSecret } from "../utils/token.util";
import { assertActiveUser } from "../bll/auth-bll/auth-user.bll";

export interface AuthenticatedUser { userId: string; email?: string; }
type AccessTokenPayload = JwtPayload & { email?: string };
declare global {
  namespace Express {
    interface Request {
      auth?: AuthenticatedUser;
      userId?: string;
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.header("authorization");
  if (!authorization?.startsWith("Bearer ")) return next(new AppError("Authentication token is required", 401));
  try {
    const payload = jwt.verify(authorization.slice(7), requireJwtSecret());
    if (typeof payload === "string") {
      return next(new AppError("Invalid authentication token", 401));
    }

    const typedPayload = payload as AccessTokenPayload;
    const userId = typedPayload.sub;

    if (typeof userId !== "string") {
      return next(new AppError("Invalid authentication token", 401));
    }

    await assertActiveUser(userId);

    req.auth = { userId, email: typedPayload.email };
    req.userId = userId;
    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError("Invalid or expired authentication token", 401));
  }
};
