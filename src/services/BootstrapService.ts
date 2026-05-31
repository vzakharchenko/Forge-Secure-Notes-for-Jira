// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import { withAppContext } from "../controllers";
import { FORGE_INJECTION_TOKENS } from "../constants";
import { inject, injectable } from "inversify";
import { JiraUserService } from "../jira";

@injectable()
export class BootstrapService {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.JiraUserService)
    private readonly jiraUserService: JiraUserService,
  ) {}

  @withAppContext()
  async isAdmin(): Promise<boolean> {
    try {
      return await this.jiraUserService.isJiraAdmin();
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error("Permission Error " + e.message, e);
      return false;
    }
  }
}
