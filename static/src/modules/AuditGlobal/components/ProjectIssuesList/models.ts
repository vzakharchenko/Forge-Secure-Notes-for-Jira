// libs
import React from "react";

export type ProjectIssuesListType = "issue" | "project";

export interface ProjectIssuesListItem {
  key: string;
  id: string;
}

export interface ProjectIssuesListProps {
  type: ProjectIssuesListType;
  title: string;
  emptyMessage: string;
  loadingMessage: string;
  tableLabel: string;
  detailPathPrefix: string;
  detailPathSegment: string;
  onItemClick?: (key: string) => void;
  DetailPageComponent: React.ComponentType<{ key?: string; timezone: string }>;
  timezone: string;
}
