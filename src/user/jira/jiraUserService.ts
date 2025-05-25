import * as api from "@forge/api";

import {CurrentUser, ServiceType, UserService} from "../UserService";

export class JiraUserService implements UserService {
    getServiceType(): ServiceType {
        return ServiceType.JIRA;
    }

    async getCurrentUser(): Promise<CurrentUser | undefined> {
        try {
            const response = await api.asUser().requestJira(api.route`/rest/api/3/myself`);
            return await response.json();
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    async getUserById(userId: string): Promise<CurrentUser|undefined> {
        try {
            const response = await api.asApp().requestJira(api.route`/rest/api/3/user?accountId=${userId}`);
            return await response.json();
               } catch (e) {
        console.error(e);
        return undefined;
    }
    }
}
