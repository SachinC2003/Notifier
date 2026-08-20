import { request } from "./client";
import type { ApiKey } from "./types";

export const apiKeysApi = {
  list: () => request<ApiKey[]>("/auth/api-keys", {}, "jwt"),
  create: (name: string) =>
    request<ApiKey>(
      "/auth/api-keys",
      { method: "POST", body: JSON.stringify({ name }) },
      "jwt",
    ),
  revoke: (id: string) =>
    request<void>(`/auth/api-keys/${id}`, { method: "DELETE" }, "jwt"),
};
