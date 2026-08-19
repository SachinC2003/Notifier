export type User = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
};

export type Event = {
  id: string;
  eventKey: string;
  name: string;
  description: string | null;
  subject: string;
  body: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  channel: string[];
  recipient: string;
  status: "QUEUED" | "PROCESSING" | "SENT" | "FAILED";
  provider: string | null;
  payload: Record<string, unknown>;
  sentAt: string | null;
  failedAt: string | null;
  createdAt: string;
  updatedAt: string;
  event: { id: string; eventKey: string; name: string };
  logs: NotificationLog[];
};

export type NotificationLog = {
  id: string;
  attemptNumber: number;
  response: unknown;
  errorMessage: string | null;
  createdAt: string;
};

export type ApiKey = {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  apiKey?: string;
};

export type AuthResponse = { user: User; accessToken: string };
