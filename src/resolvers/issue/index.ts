import Resolver from "@forge/resolver";
import {
  GetMySecurityNotesController,
  CreateSecurityNoteController,
  DeleteSecurityNoteController,
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

export const ISSUE_BINDINGS = [
  { name: FORGE_INJECTION_TOKENS.CreateSecurityNoteController, bind: CreateSecurityNoteController },
  { name: FORGE_INJECTION_TOKENS.DeleteSecurityNoteController, bind: DeleteSecurityNoteController },
  { name: FORGE_INJECTION_TOKENS.GetMySecurityNotesController, bind: GetMySecurityNotesController },

  { name: FORGE_INJECTION_TOKENS.SecurityNoteService, bind: SecurityNoteService },
  { name: FORGE_INJECTION_TOKENS.SecurityNoteRepository, bind: SecurityNoteRepository },
  { name: FORGE_INJECTION_TOKENS.BootstrapService, bind: BootstrapService },
  { name: FORGE_INJECTION_TOKENS.JiraUserService, bind: JiraUserService },
  { name: FORGE_INJECTION_TOKENS.SecurityStorage, bind: SecurityStorage },
  { name: FORGE_INJECTION_TOKENS.KVSSchemaMigrationService, bind: KVSSchemaMigrationService },
  { name: FORGE_INJECTION_TOKENS.ContextService, bind: ContextService },
  { name: FORGE_INJECTION_TOKENS.AnalyticService, bind: AnalyticService },
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
});
