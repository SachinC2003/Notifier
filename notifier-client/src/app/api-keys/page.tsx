"use client";

import { Check, Copy, KeyRound, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { apiKeysApi } from "@/lib/api/api-keys";
import type { ApiKey } from "@/lib/api/types";
import { NotifierShell, PageHeader } from "@/components/notifier-shell";

export default function ApiKeysPage() {
  const [name, setName] = useState("Production");
  const [latestKey, setLatestKey] = useState<ApiKey | null>(null);
  const [generatedKey, setGeneratedKey] = useState<ApiKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadLatestKey = async () => {
    try {
      const keys = await apiKeysApi.list();
      setLatestKey(keys[0] ?? null);
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "Unable to load the active API key.");
    } finally {
      setIsLoading(false);
    }
  };

  // The active key is loaded from the backend after the page mounts.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void loadLatestKey(); }, []);

  const createKey = async () => {
    setIsCreating(true);
    setMessage(null);
    setCopied(false);
    try {
      const key = await apiKeysApi.create(name);
      setLatestKey(key);
      setGeneratedKey(key);
      if (key.apiKey) sessionStorage.setItem("notifier.apiKey", key.apiKey);
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "Unable to generate the API key.");
    } finally {
      setIsCreating(false);
    }
  };

  const copyKey = async () => {
    if (!generatedKey?.apiKey) return;
    await navigator.clipboard.writeText(generatedKey.apiKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const visibleKey = generatedKey?.apiKey ?? latestKey?.keyPrefix;

  return (
    <NotifierShell>
      <PageHeader
        title="API keys"
        description="Use API keys to authenticate requests from your application."
        action={<button onClick={() => void createKey()} disabled={isCreating} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"><Plus size={16} />{isCreating ? "Generating..." : "Create API key"}</button>}
      />
      {message && <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>}
      {isLoading ? (
        <div className="mb-6 rounded-lg border bg-card p-5 text-sm text-muted-foreground">Loading active API key...</div>
      ) : visibleKey ? (
        <section className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-5 text-amber-950">
          <p className="font-semibold">Latest active API key</p>
          <p className="mt-1 text-sm">The full key is shown only immediately after generation. Older keys are not displayed.</p>
          <div className="mt-4 flex items-center gap-2 rounded-md border border-amber-300 bg-white p-3">
            <code className="min-w-0 flex-1 break-all text-sm">{generatedKey?.apiKey ?? `${visibleKey}••••••••`}</code>
            <button onClick={() => void copyKey()} disabled={!generatedKey?.apiKey} aria-label="Copy API key" className="rounded-md p-2 hover:bg-amber-100 disabled:opacity-40">{copied ? <Check size={16} /> : <Copy size={16} />}</button>
          </div>
        </section>
      ) : null}
      <section className="mb-6 rounded-lg border bg-card p-5">
        <h2 className="font-semibold">Generate replacement key</h2>
        <p className="mt-1 text-xs text-muted-foreground">Generating a new key revokes the previously active key.</p>
        <div className="mt-4 flex max-w-md items-end gap-3">
          <label className="grid flex-1 gap-2 text-sm font-medium">Key name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={100} className="h-10 rounded-md border bg-background px-3 font-normal" /></label>
          <button onClick={() => void createKey()} disabled={isCreating || !name.trim()} className="h-10 rounded-md border px-3 text-sm font-medium hover:bg-muted disabled:opacity-50">Generate</button>
        </div>
      </section>
      <div className="rounded-lg border bg-card px-5 py-4 text-sm text-muted-foreground"><KeyRound className="mr-2 inline-block" size={17} />Only the latest active key is shown. Revoked keys remain stored by the backend and are never usable.</div>
    </NotifierShell>
  );
}
