export type CurrentUser = {
  accountId: string;
  emailAddress: string;
  displayName: string;
  active: true;
  timeZone: string;
  avatarUrls: {
    "48x48": string;
    "24x24": string;
    "16x16": string;
    "32x32": string;
  };
  locale: string;
};

export interface CustomerRequest {
  issueId: string;
  issueKey: string;
  summary: string;
  requestTypeId: string;
  serviceDeskId: string;
  active: true;
  reporter: {
    accountId: string;
    displayName: string;
    _links: {
      avatarUrls: {
        "32x32": string;
        "48x48": string;
      };
    };
  };
  _links: {
    web: string;
  };
}

export interface UserEmail {
  accountId: string;
  email: string;
}
