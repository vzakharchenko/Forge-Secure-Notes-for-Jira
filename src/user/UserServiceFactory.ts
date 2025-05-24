import {UserFactory, UserService} from "./UserService";
import {JiraUserService} from "./jira/jiraUserService";
import {ForgeTypes} from "../core/Types";

class UserFactoryImpl implements UserFactory {
    private readonly jiraUserService: UserService = new JiraUserService();

    getUserService(type: ForgeTypes): UserService {
        switch (type) {
            case ForgeTypes.issue:
            case ForgeTypes.jiraTrigger:
            case ForgeTypes.globalJira: {
                return this.jiraUserService;
            }
            default: {
                throw new Error(`${type} UNSUPPORTED YET`);
            }
        }
    }
}

export const USER_FACTORY: UserFactory = new UserFactoryImpl();
