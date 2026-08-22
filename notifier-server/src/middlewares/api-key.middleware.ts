import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db";
import { AppError } from "../errors/app-error";
import { verifyPassword } from "../utils/password.util";

export interface ApiKeyAuth {
  id: string;
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      apiKey?: ApiKeyAuth;
    }
  }
}

/** Authenticates customer applications through the X-API-Key header. */
export const authenticateApiKey = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const rawApiKey = req.header("x-api-key");

  if (!rawApiKey) {
    return next(new AppError("X-API-Key header is required", 401));
  }

  const keyPrefix = rawApiKey.slice(0, 16);

  try {
    const apiKey = await prisma.apiKey.findUnique({
      where: { keyPrefix },
      select: {
        id: true,
        userId: true,
        keyHash: true,
        isActive: true,
        expiresAt: true,
        user: {
          select: { status: true },
        },
      },
    });

    const isValid = apiKey && (await verifyPassword(rawApiKey, apiKey.keyHash));

    if (!isValid || !apiKey.isActive || apiKey.user.status !== "ACTIVE") {
      return next(new AppError("Invalid API key", 401));
    }

    if (apiKey.expiresAt && apiKey.expiresAt <= new Date()) {
      return next(new AppError("API key has expired", 401));
    }

    req.apiKey = { id: apiKey.id, userId: apiKey.userId };

    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return next();
  } catch (error) {
    return next(error);
  }
};
