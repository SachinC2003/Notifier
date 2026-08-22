import type { NextFunction, Request, Response } from "express";
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
} from "../../bll/auth-bll/api-key.bll";
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

export const listApiKeysController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return res.json({ data: await listApiKeys(req.userId!) });
  } catch (error) {
    return next(error);
  }
};

export const revokeApiKeyController = async (
  req: Request<{ apiKeyId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await revokeApiKey(req.userId!, req.params.apiKeyId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
