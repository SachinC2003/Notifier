import { request } from "./client";
import type { CreateNotificationInput, Notification } from "./types";

export const notificationsApi = {
  send: (input: CreateNotificationInput) =>
    request<Notification>(
      "/notifications",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
      "api-key",
    ),
  list: () => request<Notification[]>("/notifications", {}, "api-key"),
  get: (id: string) =>
    request<Notification>(`/notifications/${id}`, {}, "api-key"),
  status: (id: string) =>
    request<
      Pick<Notification, "id" | "status" | "sentAt" | "failedAt"> & {
        logs: Notification["logs"];
      }
    >(`/notifications/${id}/status`, {}, "api-key"),
  remove: (id: string) =>
    request<void>(`/notifications/${id}`, { method: "DELETE" }, "api-key"),
  removeAll: () =>
    request<void>("/notifications", { method: "DELETE" }, "api-key"),
};
