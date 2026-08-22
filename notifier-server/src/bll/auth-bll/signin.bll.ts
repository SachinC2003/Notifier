import { prisma } from "../../config/db";
import type { AuthResponse, SignInInput } from "../../dtos/user.dto";
import { AppError } from "../../errors/app-error";
import { createAccessToken } from "../../utils/token.util";
import { verifyPassword } from "../../utils/password.util";
import { decryptApiKey } from "../../utils/api-key-crypto.util";
import { createApiKey } from "./api-key.bll";

/** Authenticates credentials and returns only safe user fields plus an access token. */
export const signIn = async (input: SignInInput): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      passwordHash: true,
    },
  });

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("This account is inactive", 403);
  }

  const { passwordHash: _passwordHash, ...publicUser } = user;
  const apiKey = await prisma.apiKey.findFirst({
    where: { userId: publicUser.id, isActive: true },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      isActive: true,
      encryptedKey: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });
  let loginApiKey;
  if (apiKey?.encryptedKey) {
    try {
      loginApiKey = {
        id: apiKey.id,
        name: apiKey.name,
        keyPrefix: apiKey.keyPrefix,
        isActive: apiKey.isActive,
        lastUsedAt: apiKey.lastUsedAt,
        createdAt: apiKey.createdAt,
        apiKey: decryptApiKey(apiKey.encryptedKey),
      };
    } catch {
      loginApiKey = await createApiKey(publicUser.id, {
        name: apiKey.name,
      });
    }
  } else {
    loginApiKey = await createApiKey(publicUser.id, {
      name: apiKey?.name ?? "Default API key",
    });
  }

  return {
    user: publicUser,
    accessToken: createAccessToken(publicUser),
    apiKey: loginApiKey,
  };
};
