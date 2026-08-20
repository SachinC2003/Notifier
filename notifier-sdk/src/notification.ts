import axios from "axios";
import type { SdkConfig, CreateNotificationInput, ApiResponse } from "./types";

export class NotificationModule {
  private baseUrl: string;

  constructor(private config: SdkConfig) {
    this.baseUrl = config.baseUrl || "http://localhost:3000";
  }

  /**
   * Dispatch a notification payload to your active server queue systems
   */
  async send(input: CreateNotificationInput): Promise<ApiResponse> {
    try {
      // 🌟 FIXED: Appended '/api' routing namespace prefix to match backend paths
      const response = await axios.post(`${this.baseUrl}/api/notifications`, input, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.config.apiKey,
        }
      });

      return response.data as ApiResponse;
    } catch (error: any) {
      // 🌟 FIXED: Extracts the exact error string returned by your Express API server
      const serverErrorMessage = error.response?.data?.message || error.message;
      throw new Error(`[Notifier SDK - Notification Error]: ${serverErrorMessage}`);
    }
  }
}
