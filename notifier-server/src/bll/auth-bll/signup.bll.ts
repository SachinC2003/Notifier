import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import type { AuthResponse, SignUpInput } from "../../dtos/user.dto";
import { AppError } from "../../errors/app-error";
import { hashPassword } from "../../utils/password.util";
import { createAccessToken } from "../../utils/token.util";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  status: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

/**
 * Business logic layer: owns password handling, persistence and domain errors.
 * Controllers should not contain database queries or security-sensitive logic.
 */
export const signUp = async (input: SignUpInput): Promise<AuthResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const passwordHash = await hashPassword(input.password);

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        status: "ACTIVE",
      },
      select: publicUserSelect,
    });

    return { user, accessToken: createAccessToken(user) };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError("An account with this email already exists", 409);
    }

    throw error;
  }
};
