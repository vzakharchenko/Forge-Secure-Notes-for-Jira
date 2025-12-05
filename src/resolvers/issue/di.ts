import { Container } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import {
  BootstrapService,
  KVSSchemaMigrationService,
  SecurityNoteService,
  ContextService,
  AnalyticService,
} from "../../core";
import { SecurityNoteRepository } from "../../database";
import { SecurityStorage } from "../../storage";
import {
  CreateSecurityNoteController,
  GetMySecurityNotesController,
  DeleteSecurityNoteController,
} from "../../controllers";
import { JiraUserService } from "../../user";

export const setupContainer = (): Container => {
  const container = new Container();
  container
    .bind(FORGE_INJECTION_TOKENS.CreateSecurityNoteController)
    .to(CreateSecurityNoteController);
  container
    .bind(FORGE_INJECTION_TOKENS.DeleteSecurityNoteController)
    .to(DeleteSecurityNoteController);
  container
    .bind(FORGE_INJECTION_TOKENS.GetMySecurityNotesController)
    .to(GetMySecurityNotesController);
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
