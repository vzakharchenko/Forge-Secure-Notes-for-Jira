// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

export const GLOBAL_ROUTES = {
  all: {
    route: "/",
  },
  record: {
    route: "view/:recordId",
  },
  myHistory: {
    route: "/myHistory",
  },
  myIssue: {
    route: "/myIssue",
  },
  myIssueDetail: {
    route: "/my/issue/:issueKey",
  },
  myProject: {
    route: "/myProject",
  },
  myProjectDetail: {
    route: "/my/project/:projectKey",
  },
};
