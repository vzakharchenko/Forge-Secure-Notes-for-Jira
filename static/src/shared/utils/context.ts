// helpers
import { FullContext, view } from "@forge/bridge";

export const getForgeContext = () => view.getContext();

export const getAppUrl = (context: FullContext) => {
  const appUrlParts = context.localId.split("/");
  return `${appUrlParts[1]}/${appUrlParts[2]}/view/`;
};
