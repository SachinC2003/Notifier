"use client";

import Link from "next/link";
import { Boxes, MoreHorizontal, Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { toast, useFeedback } from "@/components/feedback-provider";
import { eventsApi } from "@/lib/api/events";
import type { Event } from "@/lib/api/types";
import {
  NotifierShell,
  PageHeader,
  StatusBadge,
} from "@/components/notifier-shell";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { confirm } = useFeedback();

  const loadEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setEvents(await eventsApi.list());
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "Unable to load events.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // The first fetch drives the page's loading state from the backend.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadEvents();
  }, []);

  const toggleEvent = async (event: Event) => {
    try {
      const updated = await eventsApi.update(event.id, {
        isActive: !event.isActive,
      });
      setEvents((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      toast.success(`Event ${updated.isActive ? "enabled" : "disabled"}`);
    } catch (actionError) {
      toast.error(
        actionError instanceof ApiError
          ? actionError.message
          : "Unable to update the event.",
      );
    }
  };

  const deleteEvent = async (event: Event) => {
    const confirmed = await confirm({
      title: `Delete ${event.name}?`,
      description: "Events with notifications cannot be deleted.",
      confirmLabel: "Delete event",
      destructive: true,
    });
    if (!confirmed) return;
    try {
      await eventsApi.remove(event.id);
      setEvents((current) => current.filter((item) => item.id !== event.id));
      toast.success("Event deleted");
    } catch (actionError) {
      toast.error(
        actionError instanceof ApiError
          ? actionError.message
          : "Unable to delete the event.",
      );
    }
  };

  return (
    <NotifierShell>
      <PageHeader
        title="Events"
        description="Define the notification events your application can trigger."
        action={
          <Link
            href="/events/create"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <Plus size={16} />
            Create event
          </Link>
        }
      />
      {error && (
        <div className="mb-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            onClick={() => void loadEvents()}
            className="inline-flex items-center gap-2 font-medium"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold">Your events</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Events map application actions to notification templates.
            </p>
          </div>
          {!isLoading && (
            <span className="text-xs text-muted-foreground">
              {events.length} event{events.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
        {isLoading ? (
          <div className="space-y-3 p-5">
            <div className="h-12 animate-pulse rounded-md bg-muted" />
            <div className="h-12 animate-pulse rounded-md bg-muted" />
          </div>
        ) : events.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted">
              <Boxes size={19} className="text-muted-foreground" />
            </div>
            <h3 className="font-medium">Create your first event</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Start with an event key such as ORDER_PLACED, then use it from
              your backend to trigger delivery.
            </p>
            <Link
              href="/events/create"
              className="mt-5 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Create event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-170 text-left text-sm">
              <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Event name</th>
                  <th className="px-5 py-3 font-medium">Event key</th>
                  <th className="px-5 py-3 font-medium">Channels</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {events.map((event, index) => (
                  <tr key={event.id} className="hover:bg-muted/30">
                    <td className="px-5 py-4">
                      <Link
                        href={`/events/${event.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {event.name}
                      </Link>
                      <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
                        {event.description || "No description"}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs">
                      {event.eventKey}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {event.channel.map((channel) => (
                          <span
                            key={channel}
                            className="rounded-full bg-accent px-2 py-1 text-[11px] font-semibold text-accent-foreground"
                          >
                            {channel}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => void toggleEvent(event)}
                        title={
                          event.isActive ? "Disable event" : "Enable event"
                        }
                      >
                        <StatusBadge
                          status={event.isActive ? "ACTIVE" : "DISABLED"}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <details className="relative">
                        <summary className="flex size-8 cursor-pointer list-none items-center justify-center rounded-md hover:bg-muted">
                          <MoreHorizontal size={17} />
                        </summary>
                        <div
                          className={`absolute right-0 z-10 w-32 rounded-md border bg-card p-1 shadow-lg ${index >= events.length - 2 ? "bottom-9" : "mt-1"}`}
                        >
                          <Link
                            href={`/events/${event.id}`}
                            className="block rounded px-3 py-2 text-xs hover:bg-muted"
                          >
                            View
                          </Link>
                          <Link
                            href={`/events/${event.id}/edit`}
                            className="block rounded px-3 py-2 text-xs hover:bg-muted"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => void deleteEvent(event)}
                            className="w-full rounded px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!isLoading && events.length > 0 && (
        <div className="h-24" aria-hidden="true" />
      )}
    </NotifierShell>
  );
}
