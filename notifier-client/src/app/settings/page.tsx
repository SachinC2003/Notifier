import { NotifierShell, PageHeader } from "@/components/notifier-shell";

export default function SettingsPage() {
  return (
    <NotifierShell>
      <PageHeader
        title="Settings"
        description="Manage your profile and account security."
      />
      <div className="max-w-2xl space-y-6">
        <section className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your workspace identity.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Name
              <input
                defaultValue="Ansh Sharma"
                className="h-10 rounded-md border bg-background px-3 font-normal"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Email
              <input
                defaultValue="ansh@example.com"
                disabled
                className="h-10 rounded-md border bg-muted px-3 font-normal"
              />
            </label>
          </div>
        </section>
        <section className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold">Security</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Password changes will be available when the backend endpoint is
            added.
          </p>
          <button
            disabled
            className="mt-5 rounded-md border px-4 py-2 text-sm font-medium opacity-50"
          >
            Change password
          </button>
        </section>
        <section className="rounded-lg border border-red-200 bg-card p-6 dark:border-red-900">
          <h2 className="font-semibold">Account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign out of this workspace on this device.
          </p>
          <button className="mt-5 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30">
            Log out
          </button>
        </section>
      </div>
    </NotifierShell>
  );
}
