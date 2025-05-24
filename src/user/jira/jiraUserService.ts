import * as api from "@forge/api";

import {CurrentUser, ServiceType, UserService} from "../UserService";

let currentUserCache: CurrentUser | null = null;
const usersCache: Record<string, CurrentUser> = {};

export class JiraUserService implements UserService {
    getServiceType(): ServiceType {
        return ServiceType.JIRA;
    }

    async getCurrentUser(): Promise<CurrentUser> {
        if (currentUserCache) {
            return currentUserCache;
        }
        const response = await api.asUser().requestJira(api.route`/rest/api/3/myself`);
        const cUser = await response.json();
        currentUserCache = cUser;
        return cUser;
    }

    async getUserById(userId: string): Promise<CurrentUser> {
        if (usersCache[userId]) {
            return usersCache[userId];
        }
        const response = await api.asApp().requestJira(api.route`/rest/api/3/user?accountId=${userId}`);
        const user = await response.json();
        usersCache[userId] = user;
        return user;
    }
}
