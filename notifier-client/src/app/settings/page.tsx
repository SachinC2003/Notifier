"use client";

import { useState } from "react";
import { useEffect } from "react";
import { ApiError } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { NotifierShell, PageHeader } from "@/components/notifier-shell";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof authApi.getUser>>(null);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  useEffect(() => {
    // Browser session storage is intentionally read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(authApi.getUser());
  }, []);
  const logout = () => {
    authApi.logout();
    router.push("/");
  };

  const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordMessage(null);
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) return setPasswordMessage("All password fields are required.");
    if (passwords.newPassword !== passwords.confirmPassword) return setPasswordMessage("New passwords do not match.");
    setIsChangingPassword(true);
    try {
      await authApi.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswordMessage("Password changed successfully.");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsPasswordOpen(false);
    } catch (error) {
      setPasswordMessage(error instanceof ApiError ? error.message : "Unable to change password.");
    } finally { setIsChangingPassword(false); }
  };

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
                value={user?.name ?? ""}
                readOnly
                className="h-10 rounded-md border bg-background px-3 font-normal"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Email
              <input
                value={user?.email ?? ""}
                readOnly
                className="h-10 rounded-md border bg-muted px-3 font-normal"
              />
            </label>
          </div>
        </section>
        <section className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold">Security</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your password without leaving this page.
          </p>
          <button
            onClick={() => { setPasswordMessage(null); setIsPasswordOpen(true); }}
            className="mt-5 rounded-md border px-4 py-2 text-sm font-medium opacity-50"
          >
            Change password
          </button>
          {isPasswordOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5"><form onSubmit={changePassword} className="w-full max-w-md rounded-lg border bg-card p-6 shadow-xl"><h2 className="text-lg font-semibold">Change password</h2><div className="mt-5 grid gap-4"><PasswordField label="Current password" value={passwords.currentPassword} onChange={(value) => setPasswords((current) => ({ ...current, currentPassword: value }))} /><PasswordField label="New password" value={passwords.newPassword} onChange={(value) => setPasswords((current) => ({ ...current, newPassword: value }))} /><PasswordField label="Confirm new password" value={passwords.confirmPassword} onChange={(value) => setPasswords((current) => ({ ...current, confirmPassword: value }))} /></div>{passwordMessage && <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{passwordMessage}</p>}<div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setIsPasswordOpen(false)} className="rounded-md border px-4 py-2 text-sm">Cancel</button><button disabled={isChangingPassword} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-60">{isChangingPassword ? "Changing..." : "Change password"}</button></div></form></div>}
        </section>
        <section className="rounded-lg border border-red-200 bg-card p-6 dark:border-red-900">
          <h2 className="font-semibold">Account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign out of this workspace on this device.
          </p>
          <button
            onClick={logout}
            className="mt-5 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Log out
          </button>
        </section>
      </div>
    </NotifierShell>
  );
}

function PasswordField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="grid gap-2 text-sm font-medium">{label}<input required type="password" value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border bg-background px-3 font-normal" /></label>;
}
