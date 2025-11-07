import { resolver } from "../../core/decorators/ResolverDecorator";
import { ActualResolver } from "../../core/resolver/ActualResolver";
import { ResolverNames } from "../../../shared/ResolverNames";
import { exceptionHandler } from "../../core/decorators/ExceptionHandlerDecorator";
import { SECURITY_NOTE_SERVICE } from "../../core/services/SecurityNoteService";
import { validBodyHandler } from "../../core/decorators/ValidBodyHandlerDecorator";
import { Request } from "@forge/resolver";
import { ProjectWithPagination } from "../../../shared/dto/ProjectWithPagination";
import { AuditUser } from "../../../shared/responses/AuditUser";

@resolver
class ProjectAuditController extends ActualResolver<AuditUser> {
  functionName(): string {
    return ResolverNames.AUDIT_DATA_PER_PROJECT;
  }

  @exceptionHandler()
  @validBodyHandler(ProjectWithPagination)
  async response(req: Request<ProjectWithPagination>): Promise<AuditUser> {
    const payload: ProjectWithPagination = req.payload;
    return {
      result: await SECURITY_NOTE_SERVICE.getSecurityNoteByProject(
        payload.projectId,
        payload.limit,
        payload.offset,
      ),
    };
  }
}

export default new ProjectAuditController();
