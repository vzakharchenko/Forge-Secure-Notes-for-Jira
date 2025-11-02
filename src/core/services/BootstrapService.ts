import { USER_FACTORY } from "../../user/UserServiceFactory";
import { getAppContext, withAppContext } from "../../controllers/ApplicationContext";

interface BootstrapService {
  isAdmin(): Promise<boolean>;
}

class BootstrapServiceImpl implements BootstrapService {
  @withAppContext()
  async isAdmin(): Promise<boolean> {
    try {
      const appContext = getAppContext()!;
      return USER_FACTORY.getUserService(appContext.forgeType).isJiraAdmin();
    } catch (e: any) {
      console.error(e.message, e);
      return false;
    }
  }
}

export const BOOTSTRAP_SERVICE: BootstrapService = new BootstrapServiceImpl();
