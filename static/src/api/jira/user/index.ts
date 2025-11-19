// helpers
import jiraApi from "../../jiraApi";

// models
import { JiraUser } from "@src/shared/models/user";
import { JiraPromisedServerResponse } from "@src/shared/models/remoteClient";

// constants
import { JIRA_USER_ENDPOINTS } from "./endpoints";

export const getUsers = (
  query: string,
): JiraPromisedServerResponse<JiraUser, "jiraUserPagination"> =>
  jiraApi.get(JIRA_USER_ENDPOINTS.usersByQuery(query));
