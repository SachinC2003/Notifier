import { Bell, Search } from "lucide-react";
import { NotifierShell, PageHeader } from "@/components/notifier-shell";

export default function NotificationsPage() {
  return (
    <NotifierShell>
      <PageHeader
        title="Notifications"
        description="Monitor all notification delivery attempts."
      />
      <div className="rounded-lg border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
          <div className="flex h-10 flex-1 items-center gap-2 rounded-md border px-3 text-sm text-muted-foreground">
            <Search size={16} />
            Search by recipient or event
          </div>
          <button className="h-10 rounded-md border px-3 text-sm hover:bg-muted">
            All statuses
          </button>
          <button className="h-10 rounded-md border px-3 text-sm hover:bg-muted">
            All channels
          </button>
        </div>
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted">
            <Bell size={19} className="text-muted-foreground" />
          </div>
          <h3 className="font-medium">No delivery attempts yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Notifications sent with your API key will appear here with status
            and delivery logs.
          </p>
        </div>
      </div>
    </NotifierShell>
  );
}
