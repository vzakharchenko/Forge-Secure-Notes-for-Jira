// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

export interface GetPermissionsResponse {
  permissions: {
    [key: string]: {
      havePermission: boolean;
    };
  };
}
