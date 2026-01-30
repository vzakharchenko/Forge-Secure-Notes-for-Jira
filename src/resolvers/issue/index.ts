import Resolver from "@forge/resolver";
import {
  GetMySecurityNotesController,
  CreateSecurityNoteController,
  DeleteSecurityNoteController,
  OpenSecurityNoteController,
  FetchSecurityNoteController,
} from "../../controllers";

import { FORGE_INJECTION_TOKENS } from "../../constants";
import { withContainer } from "../../core/decorators";
import {
  AnalyticService,
  AppEventService,
  BootstrapService,
  ContextService,
  KVSSchemaMigrationService,
  SecurityNoteService,
} from "../../services";
import { SecurityNoteRepository } from "../../database";
import { JiraUserService } from "../../jira";
import { SecurityStorage } from "../../storage";

const ISSUE_BINDINGS = [
  { name: FORGE_INJECTION_TOKENS.CreateSecurityNoteController, bind: CreateSecurityNoteController },
  { name: FORGE_INJECTION_TOKENS.DeleteSecurityNoteController, bind: DeleteSecurityNoteController },
  { name: FORGE_INJECTION_TOKENS.GetMySecurityNotesController, bind: GetMySecurityNotesController },

  { name: FORGE_INJECTION_TOKENS.SecurityNoteService, bind: SecurityNoteService },
  { name: FORGE_INJECTION_TOKENS.OpenSecurityNoteController, bind: OpenSecurityNoteController },
  { name: FORGE_INJECTION_TOKENS.FetchSecurityNoteController, bind: FetchSecurityNoteController },
  { name: FORGE_INJECTION_TOKENS.SecurityNoteRepository, bind: SecurityNoteRepository },
  { name: FORGE_INJECTION_TOKENS.BootstrapService, bind: BootstrapService },
  { name: FORGE_INJECTION_TOKENS.JiraUserService, bind: JiraUserService },
  { name: FORGE_INJECTION_TOKENS.SecurityStorage, bind: SecurityStorage },
  { name: FORGE_INJECTION_TOKENS.KVSSchemaMigrationService, bind: KVSSchemaMigrationService },
  { name: FORGE_INJECTION_TOKENS.ContextService, bind: ContextService },
  { name: FORGE_INJECTION_TOKENS.AnalyticService, bind: AnalyticService },
  { name: FORGE_INJECTION_TOKENS.AppEventService, bind: AppEventService },
] as const;

export const issue = withContainer(...ISSUE_BINDINGS)((container, resolver: Resolver) => {
  container
    .get<GetMySecurityNotesController>(FORGE_INJECTION_TOKENS.GetMySecurityNotesController)
    .register(resolver, container);
  container
    .get<CreateSecurityNoteController>(FORGE_INJECTION_TOKENS.CreateSecurityNoteController)
    .register(resolver, container);
  container
    .get<DeleteSecurityNoteController>(FORGE_INJECTION_TOKENS.DeleteSecurityNoteController)
    .register(resolver, container);
  container
    .get<OpenSecurityNoteController>(FORGE_INJECTION_TOKENS.OpenSecurityNoteController)
    .register(resolver, container);
  container
    .get<FetchSecurityNoteController>(FORGE_INJECTION_TOKENS.FetchSecurityNoteController)
    .register(resolver, container);
});
