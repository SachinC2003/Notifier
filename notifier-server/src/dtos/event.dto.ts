export interface CreateEventInput {
  eventKey: string;
  name: string;
  subject: string;
  body: string;
  channel: ("EMAIL" | "SMS" | "WHATSAPP")[];
  description?: string;
}

export interface UpdateEventInput {
  eventKey?: string;
  name?: string;
  subject?: string;
  body?: string;
  description?: string | null;
  channel?: ("EMAIL" | "SMS" | "WHATSAPP")[];
  isActive?: boolean;
}
