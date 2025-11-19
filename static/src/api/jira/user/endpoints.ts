export const JIRA_USER_ENDPOINTS = {
  root: "/rest/api/3/user",
  usersByQuery(query: string) {
    return `${this.root}/picker?showAvatar=true&query="${query}"`;
  },
};
