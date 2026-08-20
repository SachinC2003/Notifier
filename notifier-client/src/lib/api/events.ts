import { request } from "./client";
import type { CreateEventInput, Event, UpdateEventInput } from "./types";

export const eventsApi = {
  list: () => request<Event[]>("/events", {}, "jwt"),
  get: (id: string) => request<Event>(`/events/${id}`, {}, "jwt"),
  create: (input: CreateEventInput) =>
    request<Event>(
      "/events",
      { method: "POST", body: JSON.stringify(input) },
      "jwt",
    ),
  update: (id: string, input: UpdateEventInput) =>
    request<Event>(
      `/events/${id}`,
      { method: "PATCH", body: JSON.stringify(input) },
      "jwt",
    ),
  remove: (id: string) =>
    request<void>(`/events/${id}`, { method: "DELETE" }, "jwt"),
};
