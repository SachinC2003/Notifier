import { prisma } from "../../config/db";
import { AppError } from "../../errors/app-error";

/** Ensures a JWT subject still belongs to an active account. */
export const assertActiveUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!user) {
    throw new AppError("Authenticated user no longer exists", 401);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("This account is inactive", 403);
  }

  return user;
};
