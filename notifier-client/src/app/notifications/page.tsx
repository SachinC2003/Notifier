"use client";

import Link from "next/link";
import { Bell, ChevronDown, RefreshCw, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { toast, useFeedback } from "@/components/feedback-provider";
import { notificationsApi } from "@/lib/api/notifications";
import type { Notification } from "@/lib/api/types";
import {
  NotifierShell,
  PageHeader,
  StatusBadge,
} from "@/components/notifier-shell";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [channel, setChannel] = useState("ALL");
  const [event, setEvent] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const { confirm } = useFeedback();

  const loadNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await notificationsApi.list();
      setNotifications(
        [...result].sort(
          (left, right) =>
            Date.parse(right.createdAt) - Date.parse(left.createdAt),
        ),
      );
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "Unable to load notifications. Add an API key first.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // The first fetch drives the page's loading state from the backend.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadNotifications();
  }, []);

  const removeNotification = async (notification: Notification) => {
    const confirmed = await confirm({
      title: "Delete notification?",
      description: `This will permanently remove the notification sent to ${notification.recipient}.`,
      confirmLabel: "Delete notification",
      destructive: true,
    });
    if (!confirmed) return;
    setDeletingId(notification.id);
    setError(null);
    try {
      await notificationsApi.remove(notification.id);
      setNotifications((current) =>
        current.filter((item) => item.id !== notification.id),
      );
      toast.success("Notification deleted");
    } catch (deleteError) {
      toast.error(
        deleteError instanceof ApiError
          ? deleteError.message
          : "Unable to delete notification.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const removeAllNotifications = async () => {
    if (!notifications.length) return;
    const confirmed = await confirm({
      title: "Delete all notifications?",
      description: `This will permanently remove all ${notifications.length} notifications and their delivery logs.`,
      confirmLabel: "Delete all",
      destructive: true,
    });
    if (!confirmed) return;
    setIsDeletingAll(true);
    setError(null);
    try {
      await notificationsApi.removeAll();
      setNotifications([]);
      toast.success("All notifications deleted");
    } catch (deleteError) {
      toast.error(
        deleteError instanceof ApiError
          ? deleteError.message
          : "Unable to delete notifications.",
      );
    } finally {
      setIsDeletingAll(false);
    }
  };

  const filtered = useMemo(
    () =>
      notifications.filter((notification) => {
        const haystack =
          `${notification.event.eventKey} ${notification.event.name} ${notification.recipient}`.toLowerCase();
        return (
          haystack.includes(search.toLowerCase()) &&
          (status === "ALL" || notification.status === status) &&
          (channel === "ALL" || notification.channel.includes(channel)) &&
          (event === "ALL" || notification.event.id === event)
        );
      }),
    [notifications, search, status, channel, event],
  );

  return (
    <NotifierShell>
      <PageHeader
        title="Notifications"
        description="Monitor all notification delivery attempts."
        action={
          <button
            onClick={() => void removeAllNotifications()}
            disabled={isDeletingAll || !notifications.length}
            className="inline-flex items-center gap-2 rounded-md border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={16} />
            {isDeletingAll ? "Deleting..." : "Delete all"}
          </button>
        }
      />
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
          <div className="flex h-10 flex-1 items-center gap-2 rounded-md border px-3 text-sm text-muted-foreground">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by recipient or event"
              className="w-full bg-transparent text-foreground outline-none"
            />
          </div>
          <div className="relative sm:w-40">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 w-full appearance-none rounded-md border bg-background px-3 pr-9 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="QUEUED">Queued</option>
              <option value="PROCESSING">Processing</option>
              <option value="SENT">Sent</option>
              <option value="FAILED">Failed</option>
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
          <div className="relative sm:w-40">
            <select
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
              className="h-10 w-full appearance-none rounded-md border bg-background px-3 pr-9 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">All channels</option>
              <option value="SMS">SMS</option>
              <option value="EMAIL">Email</option>
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
          <div className="relative sm:w-48">
            <select
              value={event}
              onChange={(input) => setEvent(input.target.value)}
              className="h-10 w-full appearance-none rounded-md border bg-background px-3 pr-9 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">All events</option>
              {[
                ...new Map(
                  notifications.map((item) => [item.event.id, item.event]),
                ).values(),
              ].map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>
        {error && (
          <div className="flex items-center justify-between border-b bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button
              onClick={() => void loadNotifications()}
              className="inline-flex items-center gap-2 font-medium"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="space-y-3 p-5">
            <div className="h-12 animate-pulse rounded-md bg-muted" />
            <div className="h-12 animate-pulse rounded-md bg-muted" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted">
              <Bell size={19} className="text-muted-foreground" />
            </div>
            <h3 className="font-medium">
              {notifications.length
                ? "No matching notifications"
                : "No delivery attempts yet"}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {notifications.length
                ? "Try changing your filters or search."
                : "Notifications sent with your API key will appear here with status and delivery logs."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left text-sm">
              <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Recipient</th>
                  <th className="px-5 py-3 font-medium">Channel</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((notification) => (
                  <tr key={notification.id} className="hover:bg-muted/30">
                    <td className="px-5 py-4">
                      <Link
                        href={`/notifications/${notification.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {notification.event.name}
                      </Link>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {notification.event.eventKey}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {notification.recipient || "Unavailable"}
                    </td>
                    <td className="px-5 py-4 text-xs">
                      {notification.channel.join(", ")}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={notification.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => void removeNotification(notification)}
                        disabled={
                          deletingId === notification.id || isDeletingAll
                        }
                        aria-label={`Delete notification for ${notification.recipient}`}
                        className="rounded-md p-2 text-red-700 hover:bg-red-50 disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </NotifierShell>
  );
}
