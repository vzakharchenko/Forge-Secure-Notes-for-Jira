// helpers
import jiraApi from "../../jiraApi";

// models
import { JiraUser } from "@src/shared/models/user";
import { JiraPromisedServerResponse } from "@src/shared/models/remoteClient";

// constants
import {
  JIRA_SERVER_INFO_ENDPOINTS,
  JIRA_USER_ENDPOINTS,
  SERVICE_DESK_REQUEST_ENDPOINTS,
} from "./endpoints";
import { CustomerRequest } from "../../../shared/models/customerRequest";
import { JiraUserApi, ServerInfoApi } from "../../../shared/models/user";

export const getUsers = (
  query: string,
): JiraPromisedServerResponse<JiraUser, "jiraUserPagination"> =>
  jiraApi.get(JIRA_USER_ENDPOINTS.usersByQuery(query));

export const getUserById = (accountId: string): JiraPromisedServerResponse<JiraUserApi, "common"> =>
  jiraApi.get(JIRA_USER_ENDPOINTS.userById(accountId));

export const getRequestByKey = (key: string): JiraPromisedServerResponse<CustomerRequest> =>
  jiraApi.get(SERVICE_DESK_REQUEST_ENDPOINTS.requestByKey(key));

export const getServerInfo = (): JiraPromisedServerResponse<ServerInfoApi, "common"> =>
  jiraApi.get(JIRA_SERVER_INFO_ENDPOINTS.serverInfo());
