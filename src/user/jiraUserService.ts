import * as api from "@forge/api";

import { CurrentUser } from "./UserService";
import { GetPermissionsResponse } from "./GetPermissionsResponse";
import { injectable } from "inversify";

@injectable()
export class JiraUserService {
  async getCurrentUser(): Promise<CurrentUser | undefined> {
    try {
      const response = await api.asUser().requestJira(api.route`/rest/api/3/myself`);
      return await response.json();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return undefined;
    }
  }

  async getUserById(userId: string): Promise<CurrentUser | undefined> {
    try {
      const response = await api
        .asApp()
        .requestJira(api.route`/rest/api/3/user?accountId=${userId}`);
      return await response.json();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return undefined;
    }
  }

  async getMyPermissions(permissions: string[]): Promise<GetPermissionsResponse> {
    return await api
      .asUser()
      .requestJira(api.route`/rest/api/3/mypermissions?permissions=${permissions.join(",")}`, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((res) => res.json());
  }

  async isJiraAdmin(): Promise<boolean> {
    const jiraPermissions = await this.getMyPermissions(["ADMINISTER", "SYSTEM_ADMIN"]);
    return (
      jiraPermissions.permissions.ADMINISTER?.havePermission ||
      jiraPermissions.permissions.SYSTEM_ADMIN?.havePermission
    );
  }
}
