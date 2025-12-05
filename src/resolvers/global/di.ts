import { Container } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import {
  BootstrapService,
  KVSSchemaMigrationService,
  SecurityNoteService,
  ContextService,
  AnalyticService,
} from "../../core";
import {
  AuditUserController,
  AuditUsersController,
  BootStrapController,
  FetchSecurityNoteController,
  IssueAuditController,
  IssueProjectsController,
  OpenSecurityNoteController,
  ProjectAuditController,
} from "../../controllers";
import { SecurityNoteRepository } from "../../database";
import { SecurityStorage } from "../../storage";
import { JiraUserService } from "../../user";

export const setupContainer = (): Container => {
  const container = new Container();
  container.bind(FORGE_INJECTION_TOKENS.AuditUserController).to(AuditUserController);
  container.bind(FORGE_INJECTION_TOKENS.AuditUsersController).to(AuditUsersController);
  container.bind(FORGE_INJECTION_TOKENS.BootStrapController).to(BootStrapController);
  container
    .bind(FORGE_INJECTION_TOKENS.FetchSecurityNoteController)
    .to(FetchSecurityNoteController);
  container.bind(FORGE_INJECTION_TOKENS.IssueAuditController).to(IssueAuditController);
  container.bind(FORGE_INJECTION_TOKENS.IssueProjectsController).to(IssueProjectsController);
  container.bind(FORGE_INJECTION_TOKENS.OpenSecurityNoteController).to(OpenSecurityNoteController);
  container.bind(FORGE_INJECTION_TOKENS.ProjectAuditController).to(ProjectAuditController);
  container.bind(FORGE_INJECTION_TOKENS.SecurityNoteService).to(SecurityNoteService);
  container.bind(FORGE_INJECTION_TOKENS.SecurityNoteRepository).to(SecurityNoteRepository);
  container.bind(FORGE_INJECTION_TOKENS.BootstrapService).to(BootstrapService);
  container.bind(FORGE_INJECTION_TOKENS.JiraUserService).to(JiraUserService);
  container.bind(FORGE_INJECTION_TOKENS.SecurityStorage).to(SecurityStorage);
  container.bind(FORGE_INJECTION_TOKENS.KVSSchemaMigrationService).to(KVSSchemaMigrationService);
  container.bind(FORGE_INJECTION_TOKENS.ContextService).to(ContextService);
  container.bind(FORGE_INJECTION_TOKENS.AnalyticService).to(AnalyticService);
  return container;
};
