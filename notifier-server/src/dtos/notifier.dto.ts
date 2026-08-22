export interface CreateNotificationInput {
  eventKey: string;
  recipient: string;
  data: Record<string, unknown>;
  channel: NotificationType[]; // "EMAIL", "SMS", "PUSH", "WHATSAPP"
}

export interface CreateApiKeyInput {
  name?: string;
}

export enum NotificationType {
  EMAIL = "EMAIL",
  SMS = "SMS",
  PUSH = "PUSH",
  WHATSAPP = "WHATSAPP",
}
