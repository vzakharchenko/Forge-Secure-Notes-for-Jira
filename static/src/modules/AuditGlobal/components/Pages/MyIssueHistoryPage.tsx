// libs
import React from "react";

// components
import ProjectIssuesList from "@src/modules/AuditGlobal/components/ProjectIssuesList/ProjectIssuesList";
import IssueAuditPage from "@src/modules/AuditGlobal/components/Pages/IssueAuditPage";
import { GLOBAL_ROUTES } from "@src/modules/AuditGlobal/constants/Routes";

export default function MyIssueHistoryPage(props: { timezone: string }) {
  const { timezone } = props;
  return (
    <ProjectIssuesList
      type="issue"
      title="My Issue History"
      emptyMessage="No issues found"
      loadingMessage="Loading issues..."
      tableLabel="My Issue History table with issue keys and actions"
      detailPathPrefix={GLOBAL_ROUTES.myIssue.route}
      detailPathSegment="issue"
      DetailPageComponent={IssueAuditPage}
      timezone={timezone}
    />
  );
}
