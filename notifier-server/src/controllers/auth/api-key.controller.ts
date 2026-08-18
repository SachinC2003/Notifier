import type { NextFunction, Request, Response } from "express";
import { createApiKey } from "../../bll/auth-bll/api-key.bll";
import type { CreateApiKeyInput } from "../../dtos/notifier.dto";

export const createApiKeyController = async (
  req: Request<unknown, unknown, CreateApiKeyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const apiKey = await createApiKey(req.userId!, req.body);
    return res.status(201).json({ message: "API key created", data: apiKey });
  } catch (error) {
    return next(error);
  }
};

