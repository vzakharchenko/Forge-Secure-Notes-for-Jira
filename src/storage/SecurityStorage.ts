import { kvs } from "@forge/kvs";
import { injectable } from "inversify";

@injectable()
export class SecurityStorage {
  async deletePayload(id: string): Promise<void> {
    await kvs.deleteSecret(id);
  }

  getPayload(id: string): Promise<string | undefined> {
    return kvs.getSecret<string>(id) as Promise<string>;
  }

  async savePayload(id: string, payload: string): Promise<void> {
    await kvs.setSecret<string>(id, payload);
  }
}
