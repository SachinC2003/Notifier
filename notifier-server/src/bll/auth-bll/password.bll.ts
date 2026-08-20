import { prisma } from "../../config/db";
import { AppError } from "../../errors/app-error";
import { hashPassword, verifyPassword } from "../../utils/password.util";
import { assertActiveUser } from "./auth-user.bll";

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  await assertActiveUser(userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });

  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    throw new AppError("Current password is incorrect", 400);
  }

  if (await verifyPassword(newPassword, user.passwordHash)) {
    throw new AppError("New password must be different", 400);
  }

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(newPassword) },
  });
};