import * as api from "@forge/api";

import { CurrentUser, CustomerRequest, UserEmail } from "./UserService";
import { GetPermissionsResponse } from "./GetPermissionsResponse";
import { injectable } from "inversify";

@injectable()
export class JiraUserService {
  async getCurrentUser(): Promise<CurrentUser | undefined> {
    try {
      const response = await api.asUser().requestJira(api.route`/rest/api/3/myself`);
      if (response.ok) {
        return await response.json();
      } else {
        // eslint-disable-next-line no-console
        console.error(await response.text());
        return undefined;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return undefined;
    }
  }

  async getUserEmail(accountId: string): Promise<UserEmail | undefined> {
    try {
      const response = await api
        .asApp()
        .requestJira(api.route`/rest/api/3/user/email?accountId=${accountId}`);
      if (response.ok) {
        return await response.json();
      } else {
        // eslint-disable-next-line no-console
        console.error(await response.text());
        return undefined;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return undefined;
    }
  }

  async getIssueByPortalKey(key: string): Promise<CustomerRequest | undefined> {
    try {
      const response = await api
        .asUser()
        .requestJira(api.route`/rest/servicedeskapi/request/${key}`);
      if (response.ok) {
        return await response.json();
      } else {
        // eslint-disable-next-line no-console
        console.warn(await response.text());
        return undefined;
      }
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
    try {
      const jiraPermissions = await this.getMyPermissions(["ADMINISTER", "SYSTEM_ADMIN"]);
      return !!(
        jiraPermissions.permissions.ADMINISTER?.havePermission ||
        jiraPermissions.permissions.SYSTEM_ADMIN?.havePermission
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Permission check error. fallback is not admin", e);
      return false;
    }
  }
}
