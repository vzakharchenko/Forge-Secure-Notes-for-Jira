// helpers
import { requestJira } from "@forge/bridge";

export default {
  async get<T>(url: string): Promise<T> {
    return requestJira(url).then((response) => response.json() as T);
  },

  async post<T, D>(url: string, data?: D): Promise<T> {
    return requestJira(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((response) => response.json() as T);
  },

  async put<T, D>(url: string, data?: D): Promise<T> {
    return requestJira(url, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((response) => response.json() as T);
  },

  async delete<T>(url: string): Promise<T> {
    return requestJira(url, {
      method: "DELETE",
    }).then((response) => response.json() as T);
  },
};
