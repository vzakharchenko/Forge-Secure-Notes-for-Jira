export const JIRA_USER_ENDPOINTS = {
  root: "/rest/api/3/user",
  usersByQuery(query: string) {
    return `${this.root}/picker?showAvatar=true&query="${query}"`;
  },
  userById(accountId: string) {
    return `${this.root}?accountId=${accountId}`;
  },
};

export const JIRA_SERVER_INFO_ENDPOINTS = {
  root: "/rest/api/3/serverInfo",
  serverInfo() {
    return `${this.root}`;
  },
};

export const SERVICE_DESK_REQUEST_ENDPOINTS = {
  root: "/rest/servicedeskapi/request",
  requestByKey(key: string) {
    return `${this.root}/${key}`;
  },
};
