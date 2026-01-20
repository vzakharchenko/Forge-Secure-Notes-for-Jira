import { Request } from "@forge/resolver";

import { BaseContext, isIssueContext } from "../core";
import { inject, injectable } from "inversify";
import { JiraUserService } from "../jira";
import { FORGE_INJECTION_TOKENS } from "../constants";

@injectable()
export class ContextService {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.JiraUserService)
    private readonly jiraUserService: JiraUserService,
  ) {}

  getContext = async <T extends BaseContext>(request: Request): Promise<T> => {
    const context = request.context as T;
    const extension = context.extension as Record<string, any>;
    if (!isIssueContext(context) && extension?.portal && extension?.request?.key) {
      const customerRequest = await this.jiraUserService.getIssueByPortalKey(extension.request.key);
      const newVar = {
        ...context,
        extension: {
          ...context.extension,
          issue: {
            id: customerRequest?.issueId ?? extension?.request?.key,
            key: customerRequest?.issueKey ?? extension?.request?.key,
            type: customerRequest?.requestTypeId,
          },
        },
        customerRequest,
      };
      return newVar as T;
    }
    return context;
  };
}
