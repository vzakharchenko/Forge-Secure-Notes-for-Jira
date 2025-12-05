import { resolver, exceptionHandler, BootstrapService } from "../../core";
import { ResolverNames } from "../../../shared/ResolverNames";
import { Bootstrap } from "../../../shared/responses";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { ActualResolver } from "..";

@injectable()
@resolver
export class BootStrapController extends ActualResolver<Bootstrap> {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.BootstrapService)
    private readonly bootstrapService: BootstrapService,
  ) {
    super();
  }

  functionName(): string {
    return ResolverNames.BOOTSTRAP;
  }

  @exceptionHandler()
  async response(): Promise<Bootstrap> {
    const isAdmin = await this.bootstrapService.isAdmin();
    return { isAdmin };
  }
}
