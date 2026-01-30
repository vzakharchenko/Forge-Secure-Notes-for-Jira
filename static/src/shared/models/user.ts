export interface JiraUser {
  accountId: string;
  displayName: string;
  avatarUrl: string;
}

export interface JiraUserApi {
  accountId: string;
  displayName: string;
  avatarUrls: {
    "32x32": string;
  };
}
export interface ServerInfoApi {
  baseUrl: string;
}
