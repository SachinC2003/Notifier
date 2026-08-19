import type { SdkConfig, CreateNotificationInput, ApiResponse } from "./types";
import axios from "axios";

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
      const response = await axios.post(`${this.baseUrl}/notifications`, input, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.config.apiKey,
        }
      });

      const body = await response.data as ApiResponse;
      if (body.success === false) {
        throw new Error(`[Notifier SDK - Notification Error]: ${body.message}`);
      }
      return body;
    } catch (error: any) {
      throw new Error(`[Notifier SDK - Notification Error]: ${error.message}`);
    }
  }
}
