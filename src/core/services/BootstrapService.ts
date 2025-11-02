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
      // eslint-disable-next-line no-console
      console.error("Permission Error " + e.message, e);
      return false;
    }
  }
}

export const BOOTSTRAP_SERVICE: BootstrapService = new BootstrapServiceImpl();
