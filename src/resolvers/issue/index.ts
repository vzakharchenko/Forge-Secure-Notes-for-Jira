import Resolver from "@forge/resolver";
import {
  GetMySecurityNotesController,
  CreateSecurityNoteController,
  DeleteSecurityNoteController,
} from "../../controllers";
import { setupContainer } from "./di";
import { FORGE_INJECTION_TOKENS } from "../../constants";

export function issue(resolver: Resolver): void {
  const container = setupContainer();
  container
    .get<GetMySecurityNotesController>(FORGE_INJECTION_TOKENS.GetMySecurityNotesController)
    .register(resolver, container);
  container
    .get<CreateSecurityNoteController>(FORGE_INJECTION_TOKENS.CreateSecurityNoteController)
    .register(resolver, container);
  container
    .get<DeleteSecurityNoteController>(FORGE_INJECTION_TOKENS.DeleteSecurityNoteController)
    .register(resolver, container);
}
