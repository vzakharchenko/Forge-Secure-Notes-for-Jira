export interface CustomerRequest {
  errorMessage?: string;
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
      };
    };
  };
}
