import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <section className="w-full max-w-2xl rounded-lg border bg-card p-8 text-center shadow-sm">
        <h1 className="text-4xl font-semibold tracking-tight">Notifier</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">Notification infrastructure for developers.</p>
        <div className="mt-8 flex justify-center gap-3"><Link href="/login" className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Log in</Link><Link href="/signup" className="rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-muted">Register</Link></div>
      </section>
    </main>
  );
}
