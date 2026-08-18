import type { NextFunction, Request, Response } from "express";
import type { SignInInput } from "../dtos/user.dto";
import { AppError } from "../errors/app-error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignIn = (
  req: Request<unknown, unknown, SignInInput>,
  _res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || !emailPattern.test(email.trim())) {
    return next(new AppError("A valid email address is required", 400));
  }

  if (typeof password !== "string" || password.length === 0) {
    return next(new AppError("Password is required", 400));
  }

  req.body = { email: email.trim().toLowerCase(), password };
  next();
};
