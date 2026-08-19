export interface SdkConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface CreateEventInput {
  eventKey: string;
  name: string;
  description?: string;
  subject: string;
  body: string;
}

export interface CreateNotificationInput {
  eventKey: string;
  recipient: string;
  channel: string[];
  data: Record<string, unknown>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
