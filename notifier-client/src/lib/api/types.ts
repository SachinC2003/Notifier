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
  channel: ("EMAIL" | "SMS" | "WHATSAPP")[];
  subject: string;
  body: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateEventInput = {
  eventKey: string;
  name: string;
  description?: string;
  subject: string;
  body: string;
  channel: ("EMAIL" | "SMS" | "WHATSAPP")[];
};

export type UpdateEventInput = Partial<CreateEventInput> & {
  isActive?: boolean;
};

export type Notification = {
  id: string;
  channel: string[];
  recipient: string;
  status: "PENDING" | "QUEUED" | "PROCESSING" | "SENT" | "FAILED";
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
  isActive: boolean;
  lastUsedAt: string | null;
  apiKey?: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  apiKey: ApiKey & { apiKey: string };
};

export type CreateNotificationInput = {
  eventKey: string;
  recipient: string;
  data: Record<string, unknown>;
  channel: string[];
};
