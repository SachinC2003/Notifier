"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleAlert, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { notificationsApi } from "@/lib/api/notifications";
import type { Notification } from "@/lib/api/types";
import {
  NotifierShell,
  PageHeader,
  StatusBadge,
} from "@/components/notifier-shell";

export default function NotificationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void params.then(async ({ id }) => {
      try {
        const result = await notificationsApi.get(id);
        if (active) setNotification(result);
      } catch (loadError) {
        if (active)
          setError(
            loadError instanceof ApiError
              ? loadError.message
              : "Unable to load notification.",
          );
      } finally {
        if (active) setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [params]);

  return (
    <NotifierShell>
      <Link
        href="/notifications"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Back to notifications
      </Link>
      {isLoading ? (
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      ) : error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : (
        notification && (
          <>
            <PageHeader
              title={notification.event.name}
              description={notification.event.eventKey}
              action={<StatusBadge status={notification.status} />}
            />
            <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
              <div className="space-y-6">
                <section className="rounded-lg border bg-card p-5">
                  <h2 className="font-semibold">Notification details</h2>
                  <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      ["ID", notification.id],
                      ["Recipient", notification.recipient],
                      ["Channel", notification.channel.join(", ")],
                      [
                        "Created",
                        new Date(notification.createdAt).toLocaleString(),
                      ],
                      [
                        "Sent",
                        notification.sentAt
                          ? new Date(notification.sentAt).toLocaleString()
                          : "Not sent",
                      ],
                      [
                        "Failed",
                        notification.failedAt
                          ? new Date(notification.failedAt).toLocaleString()
                          : "Not failed",
                      ],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-xs text-muted-foreground">
                          {label}
                        </dt>
                        <dd className="mt-1 break-all text-sm font-medium">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
                <section className="rounded-lg border bg-card p-5">
                  <h2 className="font-semibold">Payload</h2>
                  <pre className="mt-4 overflow-x-auto rounded-md bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
                    {JSON.stringify(notification.payload, null, 2)}
                  </pre>
                </section>
              </div>
              <section className="rounded-lg border bg-card p-5">
                <h2 className="font-semibold">Delivery attempts</h2>
                <div className="mt-5 space-y-5">
                  {notification.logs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No delivery logs yet.
                    </p>
                  ) : (
                    notification.logs.map((log) => (
                      <div key={log.id} className="relative flex gap-3">
                        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                          {log.errorMessage ? (
                            <CircleAlert size={15} className="text-red-600" />
                          ) : log.attemptNumber === 0 ? (
                            <Clock3 size={15} className="text-amber-600" />
                          ) : (
                            <CheckCircle2
                              size={15}
                              className="text-emerald-600"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Attempt {log.attemptNumber || 1}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {log.errorMessage ||
                              (typeof log.response === "object" &&
                              log.response !== null
                                ? JSON.stringify(log.response)
                                : "Delivery attempt recorded")}
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </>
        )
      )}
    </NotifierShell>
  );
}
