import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/event-form";
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
      <EventForm />
    </NotifierShell>
  );
}
