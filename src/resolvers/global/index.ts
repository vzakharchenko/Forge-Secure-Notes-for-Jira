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

import { setupContainer } from "./di";
import { FORGE_INJECTION_TOKENS } from "../../constants";

export function global(resolver: Resolver): void {
  const container = setupContainer();
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
}
