"use client";

import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";
import { NotifierShell, PageHeader } from "@/components/notifier-shell";

export default function DocsPage() {
  return (
    <NotifierShell>
      <PageHeader
        eyebrow="Developer docs"
        title="Build with Notifier"
        description="Trigger reliable notifications from your application with events and API keys."
      />
      <div className="grid gap-8 lg:grid-cols-[190px_1fr_180px]">
        <nav className="hidden space-y-3 text-sm text-muted-foreground lg:block">
          <p className="font-medium text-foreground">Getting started</p>
          <p>Authentication</p>
          <p>Create an event</p>
          <p>Send a notification</p>
          <p>Node.js SDK</p>
          <p>REST API</p>
          <p>Error handling</p>
        </nav>
        <article className="max-w-2xl">
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
              <Terminal size={16} />
              Quickstart
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Send your first notification
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Create an event in the dashboard, then install the SDK and trigger
              it from your backend with the event key.
            </p>
          </div>
          <CodeBlock
            code={`npm install @notifier/node\n\nimport { Notifier } from "@notifier/node";\n\nconst notifier = new Notifier({\n  apiKey: process.env.NOTIFIER_API_KEY\n});\n\nawait notifier.notifications.send({\n  eventKey: "ORDER_PLACED",\n  recipient: "customer@example.com",\n  channel: ["SMS"],\n  data: { orderId: "ORD123" }\n});`}
          />
          <h2 className="mt-10 text-xl font-semibold">Authentication</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Dashboard operations use a bearer token. Notification delivery
            requests use the generated key in the X-API-Key header.
          </p>
          <h2 className="mt-10 text-xl font-semibold">Create an event</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Events define the reusable template and channels for a notification.
            Create one in the dashboard, then use its event key in your server
            request.
          </p>
          <h2 className="mt-10 text-xl font-semibold">Send a notification</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Send JSON with an event key, recipient, channel list, and data
            object. Requests are queued and the response includes the
            notification identifier for tracking.
          </p>
          <h2 className="mt-10 text-xl font-semibold">Delivery and errors</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Use the Notifications page to inspect queued, processing, sent, and
            failed deliveries. A 401 usually means the API key is missing or
            revoked; generate a replacement key from API keys and update your
            deployment secret.
          </p>
        </article>
        <aside className="hidden border-l pl-5 text-xs text-muted-foreground lg:block">
          <p className="font-medium text-foreground">On this page</p>
          <p className="mt-4">Quickstart</p>
          <p className="mt-3">Authentication</p>
        </aside>
      </div>
    </NotifierShell>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-zinc-400">
        <span>Node.js</span>
        <button
          type="button"
          onClick={() => void copy()}
          aria-label="Copy code"
          className="hover:text-white"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}
