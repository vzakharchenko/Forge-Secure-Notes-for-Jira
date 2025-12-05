import { withAppContext } from "../../controllers";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { inject, injectable } from "inversify";
import { JiraUserService } from "../../user";

@injectable()
export class BootstrapService {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.JiraUserService)
    private readonly jiraUserService: JiraUserService,
  ) {}

  @withAppContext()
  async isAdmin(): Promise<boolean> {
    try {
      return this.jiraUserService.isJiraAdmin();
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error("Permission Error " + e.message, e);
      return false;
    }
  }
}
