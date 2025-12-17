import Resolver from "@forge/resolver";
import {
  OpenSecurityNoteController,
  FetchSecurityNoteController,
  AuditUserController,
  AuditUsersController,
  IssueProjectsController,
  IssueAuditController,
  ProjectAuditController,
  BootStrapController,
} from "../../controllers";

import { FORGE_INJECTION_TOKENS } from "../../constants";
import { withContainer } from "../../core/decorators";
import {
  AnalyticService,
  BootstrapService,
  ContextService,
  KVSSchemaMigrationService,
  SecurityNoteService,
} from "../../core";
import { SecurityNoteRepository } from "../../database";
import { JiraUserService } from "../../user";
import { SecurityStorage } from "../../storage";

export const GLOBAL_BINDINGS = [
  { name: FORGE_INJECTION_TOKENS.AuditUserController, bind: AuditUserController },
  { name: FORGE_INJECTION_TOKENS.AuditUsersController, bind: AuditUsersController },
  { name: FORGE_INJECTION_TOKENS.BootStrapController, bind: BootStrapController },
  { name: FORGE_INJECTION_TOKENS.FetchSecurityNoteController, bind: FetchSecurityNoteController },
  { name: FORGE_INJECTION_TOKENS.IssueAuditController, bind: IssueAuditController },
  { name: FORGE_INJECTION_TOKENS.IssueProjectsController, bind: IssueProjectsController },
  { name: FORGE_INJECTION_TOKENS.OpenSecurityNoteController, bind: OpenSecurityNoteController },
  { name: FORGE_INJECTION_TOKENS.ProjectAuditController, bind: ProjectAuditController },

  { name: FORGE_INJECTION_TOKENS.SecurityNoteService, bind: SecurityNoteService },
  { name: FORGE_INJECTION_TOKENS.SecurityNoteRepository, bind: SecurityNoteRepository },
  { name: FORGE_INJECTION_TOKENS.BootstrapService, bind: BootstrapService },
  { name: FORGE_INJECTION_TOKENS.JiraUserService, bind: JiraUserService },
  { name: FORGE_INJECTION_TOKENS.SecurityStorage, bind: SecurityStorage },
  { name: FORGE_INJECTION_TOKENS.KVSSchemaMigrationService, bind: KVSSchemaMigrationService },
  { name: FORGE_INJECTION_TOKENS.ContextService, bind: ContextService },
  { name: FORGE_INJECTION_TOKENS.AnalyticService, bind: AnalyticService },
] as const;

export const global = withContainer(...GLOBAL_BINDINGS)((container, resolver: Resolver) => {
  container
    .get<OpenSecurityNoteController>(FORGE_INJECTION_TOKENS.OpenSecurityNoteController)
    .register(resolver, container);
  container
    .get<FetchSecurityNoteController>(FORGE_INJECTION_TOKENS.FetchSecurityNoteController)
    .register(resolver, container);
  container
    .get<AuditUserController>(FORGE_INJECTION_TOKENS.AuditUserController)
    .register(resolver, container);
  container
    .get<AuditUsersController>(FORGE_INJECTION_TOKENS.AuditUsersController)
    .register(resolver, container);
  container
    .get<IssueProjectsController>(FORGE_INJECTION_TOKENS.IssueProjectsController)
    .register(resolver, container);
  container
    .get<IssueAuditController>(FORGE_INJECTION_TOKENS.IssueAuditController)
    .register(resolver, container);
  container
    .get<ProjectAuditController>(FORGE_INJECTION_TOKENS.ProjectAuditController)
    .register(resolver, container);
  container
    .get<BootStrapController>(FORGE_INJECTION_TOKENS.BootStrapController)
    .register(resolver, container);
});
