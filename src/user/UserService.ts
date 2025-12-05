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
