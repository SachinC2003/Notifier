const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const LOCAL_TEST_API_KEY = process.env.NEXT_PUBLIC_NOTIFIER_API_KEY;

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
    const key =
      sessionStorage.getItem("notifier.apiKey") ?? LOCAL_TEST_API_KEY;
    if (key) headers.set("X-API-Key", key);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new ApiError(
      response.status,
      body.message ?? "Something went wrong.",
    );
  return body.data as T;
}
