import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import type { SignUpInput } from "../dtos/user.dto";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates and normalizes the HTTP payload before it reaches the controller. */
export const validateSignUp = (
  req: Request<unknown, unknown, SignUpInput>,
  _res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body ?? {};

  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
    return next(new AppError("Name must be between 2 and 100 characters", 400));
  }

  if (typeof email !== "string" || !emailPattern.test(email.trim())) {
    return next(new AppError("A valid email address is required", 400));
  }

  if (typeof password !== "string" || password.length < 8 || password.length > 128) {
    return next(new AppError("Password must be between 8 and 128 characters", 400));
  }

  req.body = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  };

  next();
};
