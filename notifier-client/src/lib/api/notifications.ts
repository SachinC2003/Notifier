import { request } from "./client";
import type { Notification } from "./types";

export const notificationsApi = {
  send: (input: {
    eventKey: string;
    recipient: string;
    channel: string[];
    data: Record<string, unknown>;
  }) =>
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
};
