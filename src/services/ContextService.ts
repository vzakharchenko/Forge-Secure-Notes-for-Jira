import { Request } from "@forge/resolver";

import { BaseContext } from "../core";
import { injectable } from "inversify";

@injectable()
export class ContextService {
  getContext = <T extends BaseContext>(request: Request): T => {
    return request.context as T;
  };
}
