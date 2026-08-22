import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  CircleCheck,
  Command,
  Mail,
  Menu,
  MessageSquare,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#f7f7f2] text-[#17221e]">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_14%,rgba(226,105,72,0.12),transparent_24%),radial-gradient(circle_at_10%_36%,rgba(25,92,68,0.11),transparent_26%)]" />
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#195c44] text-[#f7f7f2] shadow-[0_5px_18px_rgba(25,92,68,0.18)]">
              <Bell size={18} />
            </span>
            Notifier
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-[#5e6c65] md:flex">
            <a
              href="#platform"
              className="transition-colors hover:text-[#17221e]"
            >
              Platform
            </a>
            <a
              href="#workflow"
              className="transition-colors hover:text-[#17221e]"
            >
              Workflow
            </a>
            <a
              href="#developers"
              className="transition-colors hover:text-[#17221e]"
            >
              Developers
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-[#5e6c65] hover:text-[#17221e] sm:block"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-md bg-[#195c44] px-4 py-2.5 text-sm font-medium text-white shadow-[0_6px_18px_rgba(25,92,68,0.18)] transition-transform hover:-translate-y-0.5"
            >
              Start building <ArrowRight size={15} />
            </Link>
            <button
              aria-label="Open navigation"
              className="rounded-md border border-[#d9ded7] p-2 text-[#5e6c65] md:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </header>

        <section className="mx-auto grid w-full max-w-7xl gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-24">
          <div className="max-w-xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#cddbd3] bg-[#eef5ef] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#195c44]">
              <span className="size-1.5 rounded-full bg-[#e26948]" />{" "}
              Notification delivery, clarified
            </div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#17221e] sm:text-6xl lg:text-[5.25rem]">
              The quiet layer behind every{" "}
              <span className="text-[#e26948]">important</span> message.
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-[#5e6c65]">
              Ship SMS and email notifications without stitching together
              queues, templates, delivery logs, and retries. Notifier keeps the
              whole signal path visible.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-md bg-[#195c44] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(25,92,68,0.2)] transition-transform hover:-translate-y-0.5"
              >
                Create your workspace <ArrowRight size={16} />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-md border border-[#d4dbd5] bg-white/65 px-5 py-3 text-sm font-semibold text-[#195c44] hover:bg-white"
              >
                Read the docs <ChevronRight size={16} />
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-5 text-xs text-[#718078]">
              <span className="inline-flex items-center gap-1.5">
                <CircleCheck size={14} className="text-[#195c44]" /> Built for
                teams
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#195c44]" /> Secure by
                default
              </span>
            </div>
          </div>
          <ProductPreview />
        </section>
      </div>

      <section className="border-y border-[#dfe4dd] bg-white/55">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-5 py-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a968f] sm:px-8 lg:px-10">
          <span>For products that care about the details</span>
          <span className="text-[#5e6c65]">API first</span>
          <span className="text-[#5e6c65]">Observable</span>
          <span className="text-[#5e6c65]">Reliable</span>
          <span className="text-[#5e6c65]">Human</span>
        </div>
      </section>

      <section
        id="platform"
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e26948]">
              One clear signal
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
              Less plumbing.
              <br />
              More momentum.
            </h2>
            <p className="mt-6 max-w-sm leading-7 text-[#5e6c65]">
              From the first API call to the final delivery log, every part of
              your notification workflow has a place.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Feature
              icon={Command}
              title="Events that map to intent"
              text="Define the moments that matter once, then trigger them from any service with a small, predictable payload."
            />
            <Feature
              icon={Radio}
              title="Delivery you can see"
              text="Know what is queued, processing, sent, or failed without searching through scattered provider dashboards."
            />
            <Feature
              icon={Zap}
              title="Channels that move"
              text="Start with SMS and email, shape one event across channels, and keep your product voice consistent."
            />
            <Feature
              icon={ShieldCheck}
              title="A calmer production"
              text="API keys, ownership boundaries, and structured logs give your team confidence as volume grows."
            />
          </div>
        </div>
      </section>

      <section id="workflow" className="border-y border-[#dfe4dd] bg-[#eaf0e9]">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-10 lg:py-28">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#195c44]">
              A better handoff
            </p>
            <h2 className="mt-4 max-w-lg text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
              Your application speaks. Notifier carries the message.
            </h2>
            <p className="mt-6 max-w-lg leading-7 text-[#5e6c65]">
              Keep business logic in your app and delivery concerns here. The
              boundary stays small, while the visibility stays rich.
            </p>
            <div className="mt-8 space-y-5">
              <Step
                number="01"
                title="Define an event"
                text="Give a meaningful moment a stable key and a message template."
              />
              <Step
                number="02"
                title="Trigger with your API key"
                text="Send the event, recipient, and data from the service you already own."
              />
              <Step
                number="03"
                title="Watch it move"
                text="Track delivery state and logs from one focused workspace."
              />
            </div>
          </div>
          <CodePreview />
        </div>
      </section>

      <section
        id="developers"
        className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8 lg:px-10 lg:py-32"
      >
        <Sparkles className="mx-auto size-5 text-[#e26948]" />
        <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
          Make every message feel considered.
        </h2>
        <p className="mx-auto mt-6 max-w-xl leading-7 text-[#5e6c65]">
          A focused notification layer for teams who want their product to feel
          as thoughtful in the background as it does on the surface.
        </p>
        <Link
          href="/signup"
          className="mt-9 inline-flex items-center gap-2 rounded-md bg-[#e26948] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(226,105,72,0.22)] transition-transform hover:-translate-y-0.5"
        >
          Start with Notifier <ArrowRight size={16} />
        </Link>
      </section>

      <footer className="border-t border-[#dfe4dd] bg-[#17221e] text-[#dbe4dc]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
          <div className="max-w-xs">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-semibold tracking-tight"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#e26948] text-white">
                <Bell size={16} />
              </span>
              Notifier
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#9cac9f]">
              Notification infrastructure for products that value clarity.
            </p>
            <p className="mt-5 text-xs leading-5 text-[#819187]">
              Reliable delivery, clear observability, and a calmer path from
              event to customer.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#819187]">
              Product
            </p>
            <div className="mt-4 grid gap-3 text-sm text-[#b9c8bc]">
              <Link href="/signup" className="hover:text-white">
                Create workspace
              </Link>
              <Link href="/login" className="hover:text-white">
                Log in
              </Link>
              <a href="#platform" className="hover:text-white">
                Platform
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#819187]">
              Developers
            </p>
            <div className="mt-4 grid gap-3 text-sm text-[#b9c8bc]">
              <Link href="/docs" className="hover:text-white">
                Documentation
              </Link>
              <a href="#workflow" className="hover:text-white">
                Workflow
              </a>
              <a href="#developers" className="hover:text-white">
                SDK and API
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#819187]">
              Company
            </p>
            <div className="mt-4 grid gap-3 text-sm text-[#b9c8bc]">
              <a href="mailto:hello@notifier.dev" className="hover:text-white">
                Contact
              </a>
              <span>API status: operational</span>
              <span>Built for dependable products</span>
            </div>
          </div>
        </div>
        <div className="border-t border-[#29483a]">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-[#819187] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <p>© 2026 Notifier. Built for dependable communication.</p>
            <p>Keep your keys private. Keep your customers informed.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
      <div className="absolute -right-8 -top-8 size-24 rounded-full border border-[#e26948]/25" />
      <div className="absolute -bottom-8 -left-8 size-32 rounded-full border border-[#195c44]/20" />
      <div className="relative overflow-hidden rounded-2xl border border-[#cfd9d0] bg-white shadow-[0_25px_80px_rgba(30,58,45,0.14)]">
        <div className="flex items-center justify-between border-b border-[#e6ebe5] px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#eaf3ec] text-[#195c44]">
              <Bell size={14} />
            </span>{" "}
            Workspace overview
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-[#63806f]">
            <span className="size-1.5 rounded-full bg-[#4caa73]" /> All systems
            normal
          </span>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-[1fr_1.25fr]">
          <div className="space-y-3">
            <div className="rounded-xl bg-[#f3f6f2] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#85938a]">
                Delivery rate
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                98.7%
              </p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#dce7de]">
                <div className="h-full w-[87%] rounded-full bg-[#4caa73]" />
              </div>
              <p className="mt-2 text-[11px] text-[#85938a]">
                +4.8% this month
              </p>
            </div>
            <div className="rounded-xl border border-[#e7ebe6] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#85938a]">
                  Channels
                </p>
                <MoreDots />
              </div>
              <div className="mt-4 flex gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-[#eef5ef] text-[#195c44]">
                  <MessageSquare size={16} />
                </span>
                <span className="flex size-9 items-center justify-center rounded-lg bg-[#fff0eb] text-[#e26948]">
                  <Mail size={16} />
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#e7ebe6] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Recent activity</p>
                <p className="mt-1 text-xs text-[#85938a]">
                  Live delivery events
                </p>
              </div>
              <span className="rounded-md bg-[#f3f6f2] px-2 py-1 text-[10px] font-semibold text-[#63806f]">
                VIEW ALL
              </span>
            </div>
            <div className="mt-5 space-y-4">
              <Activity
                icon={Check}
                label="order.confirmed"
                detail="SMS delivered"
                time="2m ago"
              />
              <Activity
                icon={Mail}
                label="invoice.ready"
                detail="Email queued"
                time="8m ago"
                accent="coral"
              />
              <Activity
                icon={Check}
                label="account.welcome"
                detail="SMS delivered"
                time="14m ago"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Activity({
  icon: Icon,
  label,
  detail,
  time,
  accent = "green",
}: {
  icon: typeof Check;
  label: string;
  detail: string;
  time: string;
  accent?: "green" | "coral";
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex size-8 items-center justify-center rounded-full ${accent === "coral" ? "bg-[#fff0eb] text-[#e26948]" : "bg-[#eaf3ec] text-[#4caa73]"}`}
      >
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-xs font-medium">{label}</p>
        <p className="mt-0.5 text-[11px] text-[#85938a]">{detail}</p>
      </div>
      <span className="text-[10px] text-[#a0aca4]">{time}</span>
    </div>
  );
}
function MoreDots() {
  return (
    <span className="flex gap-0.5">
      <i className="size-1 rounded-full bg-[#a0aca4]" />
      <i className="size-1 rounded-full bg-[#a0aca4]" />
      <i className="size-1 rounded-full bg-[#a0aca4]" />
    </span>
  );
}
function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Command;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#dfe4dd] bg-white/70 p-5 transition-transform hover:-translate-y-1">
      <span className="flex size-10 items-center justify-center rounded-lg bg-[#eaf3ec] text-[#195c44]">
        <Icon size={18} />
      </span>
      <h3 className="mt-5 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#6f7c73]">{text}</p>
    </div>
  );
}
function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="pt-0.5 font-mono text-xs font-semibold text-[#e26948]">
        {number}
      </span>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[#6f7c73]">{text}</p>
      </div>
    </div>
  );
}
function CodePreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#29483a] bg-[#17221e] shadow-[0_25px_60px_rgba(23,34,30,0.2)]">
      <div className="flex items-center gap-2 border-b border-[#29483a] px-5 py-4">
        <span className="size-2 rounded-full bg-[#e26948]" />
        <span className="size-2 rounded-full bg-[#e9c46a]" />
        <span className="size-2 rounded-full bg-[#4caa73]" />
        <span className="ml-3 font-mono text-xs text-[#819187]">
          trigger.ts
        </span>
      </div>
      <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-7 text-[#c7d8ca]">
        <code>
          <span className="text-[#e26948]">await</span> notifier.events.
          <span className="text-[#e9c46a]">trigger</span>(
          <span className="text-[#9fd3ac]">&quot;order.confirmed&quot;</span>,
          {`\n`} &#123; recipient:{" "}
          <span className="text-[#9fd3ac]">&quot;+1 415 555 0142&quot;</span>,
          {`\n`} data: &#123; orderId:{" "}
          <span className="text-[#e9c46a]">&quot;ORD-2048&quot;</span> &#125;
          &#125;{`\n`});
        </code>
      </pre>
      <div className="flex items-center gap-2 border-t border-[#29483a] px-6 py-4 text-xs text-[#9cac9f]">
        <CircleCheck size={14} className="text-[#4caa73]" /> Event accepted in
        142ms
      </div>
    </div>
  );
}
