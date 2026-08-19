import Link from "next/link";
import { Boxes, Plus } from "lucide-react";
import {
  NotifierShell,
  PageHeader,
  StatusBadge,
} from "@/components/notifier-shell";

export default function EventsPage() {
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
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold">Your events</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Events map application actions to notification templates.
            </p>
          </div>
          <StatusBadge status="ACTIVE" />
        </div>
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted">
            <Boxes size={19} className="text-muted-foreground" />
          </div>
          <h3 className="font-medium">Create your first event</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Start with an event key such as ORDER_PLACED, then use it from your
            backend to trigger delivery.
          </p>
          <Link
            href="/events/create"
            className="mt-5 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Create event
          </Link>
        </div>
      </div>
    </NotifierShell>
  );
}
