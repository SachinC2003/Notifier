"use client";

import Link from "next/link";
import { Braces, Eye } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import type { Event } from "@/lib/api/types";

export type EventFormValues = {
  name: string;
  eventKey: string;
  description: string;
  subject: string;
  body: string;
  channel: ("EMAIL" | "SMS" | "WHATSAPP")[];
};

const emptyValues: EventFormValues = {
  name: "",
  eventKey: "",
  description: "",
  subject: "",
  body: "",
  channel: ["SMS"],
};

export function eventToForm(event: Event): EventFormValues {
  return {
    name: event.name,
    eventKey: event.eventKey,
    description: event.description ?? "",
    subject: event.subject,
    body: event.body,
    channel: event.channel,
  };
}

export function EventForm({
  initialValues = emptyValues,
  eventId,
}: {
  initialValues?: EventFormValues;
  eventId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const update = (
    field: keyof Omit<EventFormValues, "channel">,
    value: string,
  ) =>
    setForm((current) => ({ ...current, [field]: value }) as EventFormValues);
  const toggleChannel = (channel: "EMAIL" | "SMS" | "WHATSAPP") =>
    setForm((current) => ({
      ...current,
      channel: current.channel.includes(channel)
        ? current.channel.filter(
            (selectedChannel) => selectedChannel !== channel,
          )
        : [...current.channel, channel],
    }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (
      !form.name ||
      !form.eventKey ||
      !form.body ||
      !form.subject ||
      form.subject.length > 255 ||
      form.channel.length === 0
    ) {
      setError(
        "Name, event key, subject, body, and at least one channel are required. Subject must be at most 255 characters.",
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const input = {
        eventKey: form.eventKey,
        name: form.name,
        description: form.description || undefined,
        subject: form.subject,
        body: form.body,
        channel: form.channel,
      };
      const saved = eventId
        ? await eventsApi.update(eventId, input)
        : await eventsApi.create(input);
      router.push(`/events/${saved.id}`);
    } catch (submitError) {
      setError(
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to save the event.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 xl:grid-cols-[1fr_360px]"
    >
      <div className="rounded-lg border bg-card p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Event name"
            value={form.name}
            onChange={(value) => update("name", value)}
            placeholder="Order placed"
          />
          <Field
            label="Event key"
            value={form.eventKey}
            onChange={(value) => update("eventKey", value)}
            placeholder="ORDER_PLACED"
            mono
          />
        </div>
        <label className="mt-5 grid gap-2 text-sm font-medium">
          Description
          <textarea
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            className="min-h-20 rounded-md border bg-background px-3 py-2 font-normal outline-none ring-primary focus:ring-2"
          />
        </label>
        <fieldset className="mt-5 grid gap-2 text-sm font-medium">
          <legend>Channels</legend>
          <div className="grid grid-cols-2 gap-3">
            {(["EMAIL", "SMS", "WHATSAPP"] as const).map((channel) => (
              <button
                key={channel}
                type="button"
                aria-pressed={form.channel.includes(channel)}
                onClick={() => toggleChannel(channel)}
                className={`rounded-md border px-3 py-2 text-left text-sm ${form.channel.includes(channel) ? "border-primary bg-accent" : "hover:bg-muted"}`}
              >
                {channel}
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  {channel === "EMAIL"
                    ? "Subject and body"
                    : "Subject and message body"}
                </span>
              </button>
            ))}
          </div>
        </fieldset>
        <label className="mt-5 grid gap-2 text-sm font-medium">
          Subject
          <input
            required
            maxLength={255}
            value={form.subject}
            onChange={(event) => update("subject", event.target.value)}
            className="h-10 rounded-md border bg-background px-3 font-normal outline-none ring-primary focus:ring-2"
          />
        </label>
        <label className="mt-5 grid gap-2 text-sm font-medium">
          Message body
          <textarea
            value={form.body}
            onChange={(event) => update("body", event.target.value)}
            className="min-h-36 rounded-md border bg-background px-3 py-2 font-mono text-sm font-normal outline-none ring-primary focus:ring-2"
          />
        </label>
        {error && (
          <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-3">
          <Link
            href="/events"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </Link>
          <button
            disabled={isSubmitting}
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {isSubmitting
              ? "Saving event..."
              : eventId
                ? "Save changes"
                : "Create event"}
          </button>
        </div>
      </div>
      <aside className="space-y-4">
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-2 font-semibold">
            <Eye size={17} />
            Live preview
          </div>
          <div className="mt-5 rounded-md border bg-muted/40 p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {form.channel.join(" + ")} preview
            </p>
            <p className="mt-4 font-medium">
              {form.subject || "Your message preview will appear here"}
            </p>
            <p className="mt-3 whitespace-pre-wrap leading-6 text-muted-foreground">
              {form.body ||
                "Use template variables to personalize each notification."}
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-2 font-semibold">
            <Braces size={17} />
            Available variables
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Use values such as {"{{customerName}}"} and {"{{orderId}}"} in your
            message.
          </p>
        </div>
      </aside>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  mono?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-10 rounded-md border bg-background px-3 font-normal outline-none ring-primary focus:ring-2 ${mono ? "font-mono" : ""}`}
      />
    </label>
  );
}
