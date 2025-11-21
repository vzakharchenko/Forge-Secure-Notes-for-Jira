// models
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";
import { ExportConfig } from "./hooks/useExportNotes";

export interface StatusHistoryItem {
  status: string;
  date: Date;
}

export interface AuditTableProps {
  fetchData: (
    offset: number,
    limit: number,
  ) => Promise<{
    notes: ViewMySecurityNotes[];
    totalCount: number;
  }>;
  exportConfig?: ExportConfig;
  showProjectKey?: boolean;
  showIssueKey?: boolean;
  timezone: string;
  itemsPerPage?: number;
  onExportReady?: (exportFn: () => void) => void;
  showExportInTable?: boolean;
}
