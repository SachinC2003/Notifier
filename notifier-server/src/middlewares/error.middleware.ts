import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error("Unhandled request error:", error);
  return res.status(500).json({ message: "Internal server error" });
};
