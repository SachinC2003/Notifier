export interface CreateEventInput {
  eventKey: string;
  name: string;
  subject: string;
  body: string;
  channel: "EMAIL" | "SMS";
  description?: string;
}

export interface UpdateEventInput {
  eventKey?: string;
  name?: string;
  subject?: string;
  body?: string;
  description?: string | null;
  channel?: "EMAIL" | "SMS";
  isActive?: boolean;
}
