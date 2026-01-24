// api
import { getRequestByKey } from "@src/api/jira/user";

// models
import { Lookup } from "@src/shared/models/form";
import { CustomerRequest } from "@src/shared/models/customerRequest";

import { JiraUser } from "@src/shared/models/user";
// components

export const getRequesterUser = (
  requestKey: string,
  callback: (options?: JiraUser & Lookup) => void,
) => {
  const trimmedValue = requestKey.trim();
  getRequestByKey(trimmedValue)
    .then((response) => {
      callback(requestToLookup(response));
    })
    .catch(() => callback());
};

export const requestToLookup = (request: CustomerRequest): JiraUser & Lookup => {
  debugger;
  return {
    accountId: request.reporter.accountId,
    displayName: request.reporter.displayName,
    value: request.reporter.accountId,
    label: request.reporter.displayName,
    avatarUrl: request.reporter._links?.avatarUrls["32x32"] ?? "",
    ...request,
  };
};
