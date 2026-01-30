import { injectable } from "inversify";
import { appEvents } from "@forge/events";
import { AppEvents } from "../constants";

@injectable()
export class AppEventService {
  async sendPresentEvent(): Promise<void> {
    const result = await appEvents.publish({ key: AppEvents.SECURE_NOTE_PRESENT });
    if (result.type === "success") {
      if (result?.failedEvents?.length) {
        const eventsThatFailedPublishing = result.failedEvents;
        if (eventsThatFailedPublishing && eventsThatFailedPublishing.length) {
          for (const event of eventsThatFailedPublishing) {
            console.warn("Publish Installation Event Failed with Error:" + event.errorMessage);
          }
        }
        console.debug("Publish Installation Event Successfully");
      }
    } else {
      // publishing failed
      const errorMessage = result.errorMessage;
      const errorType = result.errorType;
      console.error("Publish Event Failed with Error:" + errorMessage + " and Type:" + errorType);
    }
  }

  async sendExpirationEvent(): Promise<void> {
    const result = await appEvents.publish({ key: AppEvents.SECURE_NOTE_EXPIRED });
    if (result.type === "success") {
      if (result?.failedEvents?.length) {
        const eventsThatFailedPublishing = result.failedEvents;
        if (eventsThatFailedPublishing && eventsThatFailedPublishing.length) {
          for (const event of eventsThatFailedPublishing) {
            console.warn("Publish Installation Event Failed with Error:" + event.errorMessage);
          }
        }
        console.debug("Publish Installation Event Successfully");
      }
    } else {
      // publishing failed
      const errorMessage = result.errorMessage;
      const errorType = result.errorType;
      console.error("Publish Event Failed with Error:" + errorMessage + " and Type:" + errorType);
    }
  }
}
