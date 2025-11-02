export interface GetPermissionsResponse {
  permissions: {
    [key: string]: {
      havePermission: boolean;
    };
  };
}
