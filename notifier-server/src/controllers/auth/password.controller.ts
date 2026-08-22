import type { NextFunction, Request, Response } from "express";
import { changePassword } from "../../bll/auth-bll/password.bll";

type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
};

export const changePasswordController = async (
  req: Request<unknown, unknown, ChangePasswordBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { currentPassword, newPassword } = req.body ?? {};
    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      currentPassword.length === 0 ||
      newPassword.length < 8 ||
      newPassword.length > 128 ||
      !/[A-Z]/.test(newPassword) ||
      !/[^A-Za-z0-9]/.test(newPassword)
    ) {
      return res.status(400).json({
        message:
          "Passwords must be present and the new password must be 8 to 128 characters with one uppercase letter and one special character",
      });
    }

    await changePassword(req.userId!, currentPassword, newPassword);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
