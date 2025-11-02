import { Request } from "@forge/resolver";

import { BaseContext } from "./ContextTypes";

interface IContextService {
  getContext<T extends BaseContext>(request: Request): T;
}

class ContextService implements IContextService {
  getContext = <T extends BaseContext>(request: Request): T => {
    return request.context as T;
  };
}

export const CONTEXT_SERVICE: IContextService = new ContextService();
