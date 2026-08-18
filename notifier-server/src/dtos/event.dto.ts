export interface CreateEventInput {
  eventKey: string;
  name: string;
  subject: string;
  body: string;
  description?: string;
}

export interface UpdateEventInput {
  eventKey?: string;
  name?: string;
  subject?: string;
  body?: string;
  description?: string | null;
  isActive?: boolean;
}
