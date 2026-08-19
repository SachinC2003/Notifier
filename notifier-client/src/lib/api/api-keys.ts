import { request } from "./client";
import type { ApiKey } from "./types";

export const apiKeysApi = {
  create: (name: string) =>
    request<ApiKey>(
      "/auth/api-keys",
      { method: "POST", body: JSON.stringify({ name }) },
      "jwt",
    ),
};
