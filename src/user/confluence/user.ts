import * as api from "@forge/api";

import {CurrentUser, ServiceType, UserService} from "../UserService";

export class ConfluenceUserService implements UserService {
    getServiceType(): ServiceType {
        return ServiceType.CONFLUENCE;
    }

    async getCurrentUser(): Promise<CurrentUser> {
        const response = await api.asUser().requestConfluence(api.route`/wiki/rest/api/user/current`);
        return response.json();
    }

    async getUserById(userId: string): Promise<CurrentUser> {
        const response = await api.asUser().requestConfluence(api.route`/wiki/rest/api/user?accountId=${userId}`);
        return response.json();
    }
}
