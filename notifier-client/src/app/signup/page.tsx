"use client";

import Link from "next/link";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api/client";
import { toast } from "@/components/feedback-provider";
import { authApi } from "@/lib/api/auth";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (
      form.password.length < 8 ||
      form.password.length > 128 ||
      !/[A-Z]/.test(form.password) ||
      !/[^A-Za-z0-9]/.test(form.password)
    ) {
      setError(
        "Password must be 8 to 128 characters and include one uppercase letter and one special character.",
      );
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await authApi.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      toast.success("Account created");
      router.replace("/dashboard");
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to create your account.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start building reliable notification workflows."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          label="Name"
          type="text"
          value={form.name}
          onChange={(value) => update("name", value)}
          placeholder="Your name"
        />
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) => update("email", value)}
          placeholder="you@company.com"
        />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={(value) => update("password", value)}
          placeholder="At least 8 characters"
        />
        <p className="-mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} className="text-primary" /> 8+ characters, one
          uppercase letter, one special character
        </p>
        <Field
          label="Confirm password"
          type="password"
          value={form.confirmPassword}
          onChange={(value) => update("confirmPassword", value)}
          placeholder="Repeat your password"
        />
        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <span className="relative">
        <input
          required
          type={type === "password" && !visible ? "password" : "text"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-md border bg-background px-3 pr-11 font-normal outline-none ring-primary focus:ring-2"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground"
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </span>
    </label>
  );
}

function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,var(--accent),transparent_40%),linear-gradient(135deg,var(--background),var(--muted))] px-5 py-10">
      <div className="w-full max-w-md rounded-xl border bg-card/95 p-7 shadow-xl shadow-black/5 backdrop-blur sm:p-9">
        <div className="mb-8">
          <Link href="/login" className="font-semibold tracking-tight">
            Notifier
          </Link>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </div>
    </main>
  );
}
