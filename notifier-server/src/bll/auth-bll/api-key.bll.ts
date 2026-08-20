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

  const apiKey = await prisma.$transaction(async (transaction) => {
    await transaction.apiKey.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });

    return transaction.apiKey.create({
      data: { userId, name, keyPrefix, keyHash },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
      },
    });
  });

  // The raw key must be shown exactly once; only its bcrypt hash is persisted.
  return { ...apiKey, apiKey: rawApiKey };
};

export const listApiKeys = async (userId: string) => {
  await assertActiveUser(userId);
  return prisma.apiKey.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      isActive: true,
      lastUsedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const revokeApiKey = async (userId: string, apiKeyId: string) => {
  await assertActiveUser(userId);
  const result = await prisma.apiKey.updateMany({
    where: { id: apiKeyId, userId, isActive: true },
    data: { isActive: false },
  });
  if (result.count === 0) throw new AppError("Active API key not found", 404);
};
