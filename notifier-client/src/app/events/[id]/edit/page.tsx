"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { toast } from "@/components/feedback-provider";
import { eventsApi } from "@/lib/api/events";
import { EventForm, eventToForm } from "@/components/event-form";
import { NotifierShell, PageHeader } from "@/components/notifier-shell";
import type { Event } from "@/lib/api/types";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void params.then(({ id }) =>
      eventsApi
        .get(id)
        .then(setEvent)
        .catch((loadError) => {
          const message =
            loadError instanceof ApiError
              ? loadError.message
              : "Unable to load event.";
          setError(message);
          toast.error(message);
        }),
    );
  }, [params]);

  return (
    <NotifierShell>
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Back to events
      </Link>
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : event ? (
        <>
          <PageHeader
            title={`Edit ${event.name}`}
            description="Update this event configuration."
          />
          <EventForm eventId={event.id} initialValues={eventToForm(event)} />
        </>
      ) : (
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      )}
    </NotifierShell>
  );
}
