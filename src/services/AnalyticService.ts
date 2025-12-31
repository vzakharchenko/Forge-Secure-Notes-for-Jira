import { fetch, getAppContext } from "@forge/api";
import { injectable } from "inversify";

@injectable()
export class AnalyticService {
  parseVersion(raw: string) {
    return raw.replace(/[^0-9]/g, "");
  }
  async sendAnalytics(
    eventName: string,
    resolverName: string,
    cloudId: string,
    data: { totalDbExecutionTime: number; totalResponseSize: number },
  ): Promise<void> {
    if (!process.env.ANALYTICS_API_KEY) {
      return;
    }
    const appContext = getAppContext();
    const properties = {
      resolverName,
      cloudId,
      envName: appContext.environmentType,
      envId: appContext.environmentAri.environmentId,
      version: appContext.appVersion,
      parsedVersion: this.parseVersion(appContext.appVersion),
      totalDbExecutionTime: data.totalDbExecutionTime,
      totalResponseSize: data.totalResponseSize,
      eventVersion: 1,
    };
    await fetch("https://eu.i.posthog.com/capture/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.ANALYTICS_API_KEY,
        event: eventName,
        distinct_id: cloudId,
        timestamp: new Date().toISOString(),
        properties: properties,
      }),
    });
  }
}
