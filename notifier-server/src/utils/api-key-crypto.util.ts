import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { requireJwtSecret } from "./token.util";

const algorithm = "aes-256-gcm";
const key = () => createHash("sha256").update(requireJwtSecret()).digest();

export const encryptApiKey = (value: string) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, key(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, encrypted].map((part) => part.toString("base64url")).join(".");
};

export const decryptApiKey = (value: string) => {
  const [ivValue, authTagValue, encryptedValue] = value.split(".");
  if (!ivValue || !authTagValue || !encryptedValue) throw new Error("Invalid encrypted API key");
  const decipher = createDecipheriv(algorithm, key(), Buffer.from(ivValue, "base64url"));
  decipher.setAuthTag(Buffer.from(authTagValue, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
};
