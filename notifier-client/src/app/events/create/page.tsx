import Link from "next/link";
import { ArrowLeft, Braces, Eye } from "lucide-react";
import { NotifierShell, PageHeader } from "@/components/notifier-shell";

export default function CreateEventPage() {
  return (
    <NotifierShell>
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Back to events
      </Link>
      <PageHeader
        title="Create event"
        description="Configure the message your application will send through this event."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <form className="rounded-lg border bg-card p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Event name
              <input
                name="name"
                placeholder="Order placed"
                className="h-10 rounded-md border bg-background px-3 font-normal outline-none ring-primary focus:ring-2"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Event key
              <input
                name="eventKey"
                placeholder="ORDER_PLACED"
                className="h-10 rounded-md border bg-background px-3 font-mono text-sm font-normal outline-none ring-primary focus:ring-2"
              />
            </label>
          </div>
          <label className="mt-5 grid gap-2 text-sm font-medium">
            Description
            <textarea
              name="description"
              placeholder="When an order is successfully placed."
              className="min-h-20 rounded-md border bg-background px-3 py-2 font-normal outline-none ring-primary focus:ring-2"
            />
          </label>
          <div className="mt-5 grid gap-2 text-sm font-medium">
            Channel
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="rounded-md border border-primary bg-accent px-3 py-2 text-left text-sm"
              >
                EMAIL
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  Subject and body
                </span>
              </button>
              <button
                type="button"
                className="rounded-md border px-3 py-2 text-left text-sm hover:bg-muted"
              >
                SMS
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  Message body only
                </span>
              </button>
            </div>
          </div>
          <label className="mt-5 grid gap-2 text-sm font-medium">
            Subject
            <input
              name="subject"
              placeholder="Your order {{orderId}} has been placed"
              className="h-10 rounded-md border bg-background px-3 font-normal outline-none ring-primary focus:ring-2"
            />
          </label>
          <label className="mt-5 grid gap-2 text-sm font-medium">
            Message body
            <textarea
              name="body"
              placeholder="Hello {{customerName}}, your order {{orderId}} has been placed."
              className="min-h-36 rounded-md border bg-background px-3 py-2 font-mono text-sm font-normal outline-none ring-primary focus:ring-2"
            />
          </label>
          <div className="mt-5 flex justify-end gap-3">
            <Link
              href="/events"
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Create event
            </button>
          </div>
        </form>
        <aside className="space-y-4">
          <div className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2 font-semibold">
              <Eye size={17} />
              Live preview
            </div>
            <div className="mt-5 rounded-md border bg-muted/40 p-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email preview
              </p>
              <p className="mt-4 font-medium">
                Your message preview will appear here
              </p>
              <p className="mt-3 leading-6 text-muted-foreground">
                Use template variables to personalize each notification.
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2 font-semibold">
              <Braces size={17} />
              Available variables
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Insert these placeholders in your subject or body.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["customerName", "orderId", "amount"].map((variable) => (
                <code
                  key={variable}
                  className="rounded bg-muted px-2 py-1 text-xs"
                >{`{{${variable}}}`}</code>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </NotifierShell>
  );
}
