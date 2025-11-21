// libs
import React from "react";

// components
import ProjectIssuesList from "@src/modules/Administration/components/ProjectIssuesList/ProjectIssuesList";
import ProjectAuditPage from "@src/modules/Administration/components/Pages/ProjectAuditPage";
import { GLOBAL_ROUTES } from "@src/modules/Administration/constants/Routes";

export default function MyProjectHistoryPage() {
  return (
    <ProjectIssuesList
      type="project"
      title="My Project History"
      emptyMessage="No projects found"
      loadingMessage="Loading projects..."
      tableLabel="My Project History table with project keys and actions"
      detailPathPrefix={GLOBAL_ROUTES.myProject.route}
      detailPathSegment="project"
      DetailPageComponent={ProjectAuditPage}
    />
  );
}
