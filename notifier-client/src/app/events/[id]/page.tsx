"use client";

import Link from "next/link";
import { ArrowLeft, Copy, Pencil, Power, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { toast, useFeedback } from "@/components/feedback-provider";
import { eventsApi } from "@/lib/api/events";
import type { Event } from "@/lib/api/types";
import {
  NotifierShell,
  PageHeader,
  StatusBadge,
} from "@/components/notifier-shell";

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { confirm } = useFeedback();

  useEffect(() => {
    let active = true;
    void params.then(async ({ id }) => {
      try {
        const result = await eventsApi.get(id);
        if (active) setEvent(result);
      } catch (loadError) {
        if (active)
          setError(
            loadError instanceof ApiError
              ? loadError.message
              : "Unable to load event.",
          );
      } finally {
        if (active) setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [params]);

  const toggle = async () => {
    if (!event) return;
    setIsSaving(true);
    try {
      setEvent(await eventsApi.update(event.id, { isActive: !event.isActive }));
      toast.success(`Event ${event.isActive ? "disabled" : "enabled"}`);
    } catch (actionError) {
      setError(
        actionError instanceof ApiError
          ? actionError.message
          : "Unable to update event.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async () => {
    if (
      !event ||
      !(await confirm({
        title: `Delete ${event.name}?`,
        description:
          "This event and its configuration will be permanently removed.",
        confirmLabel: "Delete event",
        destructive: true,
      }))
    )
      return;
    setIsSaving(true);
    try {
      await eventsApi.remove(event.id);
      toast.success("Event deleted");
      router.push("/events");
    } catch (actionError) {
      setError(
        actionError instanceof ApiError
          ? actionError.message
          : "Unable to delete event.",
      );
      setIsSaving(false);
    }
  };

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <NotifierShell>
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Back to events
      </Link>
      {isLoading ? (
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      ) : error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : (
        event && (
          <>
            <PageHeader
              title={event.name}
              description={event.description || "No description"}
              action={
                <div className="flex items-center gap-2">
                  <StatusBadge
                    status={event.isActive ? "ACTIVE" : "DISABLED"}
                  />
                  <button
                    onClick={() => void toggle()}
                    disabled={isSaving}
                    className="rounded-md border p-2 hover:bg-muted"
                    title={event.isActive ? "Disable event" : "Enable event"}
                  >
                    <Power size={16} />
                  </button>
                  <Link
                    href={`/events/${event.id}/edit`}
                    className="rounded-md border p-2 hover:bg-muted"
                    title="Edit event"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => void remove()}
                    disabled={isSaving}
                    className="rounded-md border p-2 text-red-600 hover:bg-red-50"
                    title="Delete event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              }
            />
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <section className="rounded-lg border bg-card p-5">
                <h2 className="font-semibold">Message configuration</h2>
                <dl className="mt-5 grid gap-4">
                  <div>
                    <dt className="text-xs text-muted-foreground">Event key</dt>
                    <dd className="mt-1 flex items-center gap-2 font-mono text-sm">
                      {event.eventKey}
                      <button
                        onClick={() => void copy(event.eventKey)}
                        aria-label="Copy event key"
                      >
                        <Copy size={14} />
                      </button>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Available channels
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {event.channel.map((channel) => (
                        <span
                          key={channel}
                          className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground"
                        >
                          {channel}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Subject</dt>
                    <dd className="mt-1 text-sm">
                      {event.subject || "No subject"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Body</dt>
                    <dd className="mt-1 whitespace-pre-wrap rounded-md bg-muted/40 p-3 text-sm leading-6">
                      {event.body}
                    </dd>
                  </div>
                </dl>
              </section>
              <section className="rounded-lg border bg-card p-5">
                <h2 className="font-semibold">Integration</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Trigger this event from an application using the event key.
                </p>
                <pre className="mt-4 overflow-x-auto rounded-md bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">{`await notifier.notifications.send({\n  eventKey: "${event.eventKey}",\n  recipient: "customer@example.com",\n  channel: ["SMS"],\n  data: { orderId: "ORD123" }\n});`}</pre>
                <button
                  onClick={() =>
                    void copy(
                      `await notifier.notifications.send({ eventKey: "${event.eventKey}", recipient: "customer@example.com", channel: ["SMS"], data: { orderId: "ORD123" } });`,
                    )
                  }
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Copy size={14} />
                  Copy example
                </button>
              </section>
            </div>
          </>
        )
      )}
    </NotifierShell>
  );
}
