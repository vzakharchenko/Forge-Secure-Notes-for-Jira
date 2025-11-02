import { resolver } from "../../core/decorators/ResolverDecorator";
import { ActualResolver } from "../../core/resolver/ActualResolver";
import { ResolverNames } from "../../../shared/ResolverNames";
import { exceptionHandler } from "../../core/decorators/ExceptionHandlerDecorator";
import { Bootstrap } from "../../../shared/responses/Bootstrap";
import { BOOTSTRAP_SERVICE } from "../../core/services/BootstrapService";

@resolver
class AuditUsersController extends ActualResolver<Bootstrap> {
  functionName(): string {
    return ResolverNames.BOOTSTRAP;
  }

  @exceptionHandler()
  async response(): Promise<Bootstrap> {
    const isAdmin = await BOOTSTRAP_SERVICE.isAdmin();
    return { isAdmin };
  }
}

export default new AuditUsersController();
