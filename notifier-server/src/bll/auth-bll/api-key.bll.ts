import { randomBytes } from "node:crypto";
import { prisma } from "../../config/db";
import type { CreateApiKeyInput } from "../../dtos/notifier.dto";
import { AppError } from "../../errors/app-error";
import { hashPassword } from "../../utils/password.util";
import { assertActiveUser } from "./auth-user.bll";

export const createApiKey = async (userId: string, input: CreateApiKeyInput) => {
  await assertActiveUser(userId);

  const name = input.name?.trim() || "Default API key";

  if (name.length > 100) {
    throw new AppError("API key name must be at most 100 characters", 400);
  }

  const rawApiKey = `ntf_${randomBytes(32).toString("base64url")}`;
  const keyPrefix = rawApiKey.slice(0, 16);
  const keyHash = await hashPassword(rawApiKey);

  const apiKey = await prisma.apiKey.create({
    data: {
      userId,
      name,
      keyPrefix,
      keyHash,
    },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      createdAt: true,
    },
  });

  // The raw key must be shown exactly once; only its bcrypt hash is persisted.
  return { ...apiKey, apiKey: rawApiKey };
};
