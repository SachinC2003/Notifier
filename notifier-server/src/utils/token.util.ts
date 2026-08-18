import jwt from "jsonwebtoken";
import type { PublicUser } from "../dtos/user.dto";

export const requireJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  return secret;
};

export const createAccessToken = (user: PublicUser): string =>
  jwt.sign(
    { sub: user.id, email: user.email },
    requireJwtSecret(),
    { expiresIn: "1h" },
  );
