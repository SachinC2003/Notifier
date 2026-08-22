import { request } from "./client";
import type { AuthResponse } from "./types";

const saveSession = (auth: AuthResponse) => {
  if (typeof window === "undefined") return;
  const previousUser = sessionStorage.getItem("notifier.user");
  const previousUserId = previousUser
    ? (JSON.parse(previousUser) as AuthResponse["user"]).id
    : null;
  if (previousUserId !== auth.user.id)
    sessionStorage.removeItem("notifier.apiKey");
  sessionStorage.setItem("notifier.accessToken", auth.accessToken);
  sessionStorage.setItem("notifier.user", JSON.stringify(auth.user));
  if (auth.apiKey.apiKey)
    sessionStorage.setItem("notifier.apiKey", auth.apiKey.apiKey);
};

export const authApi = {
  register: async (input: {
    name: string;
    email: string;
    password: string;
  }) => {
    const auth = await request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
    saveSession(auth);
    return auth;
  },
  login: async (input: { email: string; password: string }) => {
    const auth = await request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
    saveSession(auth);
    return auth;
  },
  logout: () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("notifier.accessToken");
    sessionStorage.removeItem("notifier.user");
    sessionStorage.removeItem("notifier.apiKey");
  },
  changePassword: (input: { currentPassword: string; newPassword: string }) =>
    request<void>(
      "/auth/password",
      { method: "PATCH", body: JSON.stringify(input) },
      "jwt",
    ),
  getUser: () => {
    if (typeof window === "undefined") return null;
    const value = sessionStorage.getItem("notifier.user");
    return value ? (JSON.parse(value) as AuthResponse["user"]) : null;
  },
};
