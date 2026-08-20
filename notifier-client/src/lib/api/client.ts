const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function request<T>(
  path: string,
  init: RequestInit = {},
  auth?: "jwt" | "api-key",
) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (auth === "jwt" && typeof window !== "undefined") {
    const token = sessionStorage.getItem("notifier.accessToken");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  if (auth === "api-key" && typeof window !== "undefined") {
    const key = sessionStorage.getItem("notifier.apiKey");
    if (key) headers.set("X-API-Key", key);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (
      response.status === 401 &&
      auth === "jwt" &&
      typeof window !== "undefined"
    ) {
      sessionStorage.removeItem("notifier.accessToken");
      sessionStorage.removeItem("notifier.user");
      window.dispatchEvent(new Event("notifier:session-expired"));
    }

    throw new ApiError(
      response.status,
      getUserMessage(response.status, body.message),
    );
  }
  return body.data as T;
}

function getUserMessage(status: number, message?: string) {
  if (message) return message;

  const messages: Record<number, string> = {
    400: "The request is invalid.",
    401: "Your session has expired. Please log in again.",
    403: "You do not have permission to perform this action.",
    404: "The requested resource was not found.",
    409: "This change conflicts with existing data.",
    422: "Please check the form fields and try again.",
    429: "Too many requests. Please try again shortly.",
    500: "The server encountered an error.",
  };

  return messages[status] ?? "Something went wrong.";
}
