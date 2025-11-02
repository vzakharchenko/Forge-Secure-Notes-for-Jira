import Resolver from "@forge/resolver";
import OpenSecurityNoteController from "../../controllers/global/OpenSecurityNoteController";
import FetchSecurityNoteController from "../../controllers/global/FetchSecurityNoteController";
import AuditUserController from "../../controllers/global/AuditUserController";
import AuditUsersController from "../../controllers/global/AuditUsersController";
import IssueProjectsController from "../../controllers/global/IssueProjectsController";
import IssueAuditController from "../../controllers/global/IssueAuditController";
import ProjectAuditController from "../../controllers/global/ProjectAuditController";
import BootStrapController from "../../controllers/global/BootStrapController";

export default function (resolver: Resolver): void {
  OpenSecurityNoteController.register(resolver);
  FetchSecurityNoteController.register(resolver);
  AuditUserController.register(resolver);
  AuditUsersController.register(resolver);
  IssueProjectsController.register(resolver);
  IssueAuditController.register(resolver);
  ProjectAuditController.register(resolver);
  BootStrapController.register(resolver);
}
