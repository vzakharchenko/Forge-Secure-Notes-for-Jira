export const GLOBAL_ROUTES = {
  all: {
    route: "/",
  },
  record: {
    route: "view/:recordId",
  },
  viewCustomAppRecord: {
    route: "custom/:appId/:envId/view/:recordId",
  },
  newCustomAppRecord: {
    route: "custom/:appId/:envId/create",
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
