import { KeyRound, Plus } from "lucide-react";
import { NotifierShell, PageHeader } from "@/components/notifier-shell";

export default function ApiKeysPage() {
  return (
    <NotifierShell>
      <PageHeader
        title="API keys"
        description="Use API keys to authenticate requests from your application."
        action={
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
            <Plus size={16} />
            Create API key
          </button>
        }
      />
      <div className="rounded-lg border bg-card">
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted">
            <KeyRound size={19} className="text-muted-foreground" />
          </div>
          <h3 className="font-medium">API key management is being connected</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            The current backend can create keys once, but does not yet expose
            list or revoke endpoints. Keys will appear here when those contracts
            are available.
          </p>
        </div>
      </div>
    </NotifierShell>
  );
}
