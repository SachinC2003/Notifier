export interface SdkConfig {
  apiKey: string;
  [key: string]: unknown;
}

import { NotificationModule } from "./notification";

export class Notifier {
  public notifications: NotificationModule;

  constructor(config: SdkConfig) {
    if (!config.apiKey || config.apiKey.trim() === "") {
      throw new Error("[Notifier SDK Initialization Error]: An API key is strictly required.");
    }

    // Instantiating sub-classes with configuration context
    this.notifications = new NotificationModule(config);
  }
}
