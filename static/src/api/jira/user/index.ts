// helpers
import jiraApi from "../../jiraApi";

// models
import { JiraUser } from "@src/shared/models/user";
import { JiraPromisedServerResponse } from "@src/shared/models/remoteClient";

// constants
import { JIRA_USER_ENDPOINTS, SERVICE_DESK_REQUEST_ENDPOINTS } from "./endpoints";
import { CustomerRequest } from "../../../shared/models/customerRequest";

export const getUsers = (
  query: string,
): JiraPromisedServerResponse<JiraUser, "jiraUserPagination"> =>
  jiraApi.get(JIRA_USER_ENDPOINTS.usersByQuery(query));

export const getRequestByKey = (key: string): JiraPromisedServerResponse<CustomerRequest> =>
  jiraApi.get(SERVICE_DESK_REQUEST_ENDPOINTS.requestByKey(key));
