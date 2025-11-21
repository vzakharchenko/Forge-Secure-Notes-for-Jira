// libs
import { useEffect, useState, useCallback } from "react";

// helpers
import { invoke, showFlag } from "@forge/bridge";
import { useLocation } from "react-router-dom";

// models
import { ResolverNames } from "@shared/ResolverNames";
import { ProjectIssue } from "@shared/responses/ProjectIssue";
import { ProjectIssuesListType, ProjectIssuesListItem } from "../models";

export const useProjectIssuesList = (type: ProjectIssuesListType, detailPathSegment: string) => {
  const location = useLocation();
  const [items, setItems] = useState<ProjectIssuesListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await invoke<ProjectIssue>(ResolverNames.AUDIT_ISSUES_AND_PROJECTS);

      if (response.isError) {
        showFlag({
          id: `load${type === "issue" ? "Issues" : "Projects"}`,
          title: `Failed to load ${type === "issue" ? "issues" : "projects"}`,
          description:
            response.message ?? `Failed to load ${type === "issue" ? "issues" : "projects"}`,
          type: "error",
          appearance: "error",
          isAutoDismiss: true,
        });
        return;
      }

      const keyField = type === "issue" ? "issueKey" : "projectKey";
      const idField = type === "issue" ? "issueId" : "projectId";

      const uniqueItems = Array.from(
        new Map(
          (response.result ?? [])
            .filter((item) => item[keyField])
            .map((item) => [item[keyField], { key: item[keyField]!, id: item[idField]! }]),
        ).values(),
      );
      setItems(uniqueItems);
    } catch (error: any) {
      console.error(`Error fetching ${type === "issue" ? "issues" : "projects"}:`, error);
      showFlag({
        id: `load${type === "issue" ? "Issues" : "Projects"}`,
        title: `Failed to load ${type === "issue" ? "issues" : "projects"}`,
        description: error.message ?? `Failed to load ${type === "issue" ? "issues" : "projects"}`,
        type: "error",
        appearance: "error",
        isAutoDismiss: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    // Load data only if we are on the main list page (not on detail page)
    if (!location.pathname.includes(`/${detailPathSegment}/`)) {
      fetchItems();
    }
  }, [location.pathname, detailPathSegment]);

  return { items, isLoading, fetchItems };
};
