import { kvs } from "@forge/kvs";

export interface SecurityStorage {
  savePayload(id: string, payload: string): Promise<void>;
  getPayload(id: string): Promise<string | undefined>;
  deletePayload(id: string): Promise<void>;
}

class SecurityStorageImpl implements SecurityStorage {
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

export const SECURITY_STORAGE = new SecurityStorageImpl();
