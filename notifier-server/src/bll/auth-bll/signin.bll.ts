import { prisma } from "../../config/db";
import type { AuthResponse, SignInInput } from "../../dtos/user.dto";
import { AppError } from "../../errors/app-error";
import { createAccessToken } from "../../utils/token.util";
import { verifyPassword } from "../../utils/password.util";

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
  return { user: publicUser, accessToken: createAccessToken(publicUser) };
};
