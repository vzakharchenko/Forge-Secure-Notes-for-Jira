// libs
import { invoke, showFlag } from "@forge/bridge";

// models
import { AuditUser } from "@shared/responses/AuditUser";
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";
import { ResolverNames } from "@shared/ResolverNames";

// helpers
import { convertNotesToCSV, downloadCSV } from "@src/utils/csvUtils";

export interface ExportConfig {
  resolverName: ResolverNames;
  params: Record<string, unknown>;
  filenamePrefix: string;
}

export const useExportNotes = () => {
  const exportNotes = async (config: ExportConfig) => {
    try {
      showFlag({
        id: "exportStart",
        title: "Exporting data",
        description: "Loading all data for export...",
        type: "info",
        appearance: "info",
        isAutoDismiss: false,
      });

      const allNotes: ViewMySecurityNotes[] = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await invoke<AuditUser>(config.resolverName, {
          ...config.params,
          limit: 100,
          offset: offset,
        });

        if (response.isError) {
          showFlag({
            id: "exportError",
            title: "Export failed",
            description: response.message ?? "Failed to load data for export",
            type: "error",
            appearance: "error",
            isAutoDismiss: true,
          });
          return;
        }

        const notes = response.result ?? [];
        if (notes.length === 0) {
          hasMore = false;
        } else {
          allNotes.push(...notes);
          offset += notes.length;
          const totalCount = notes[0]?.count ?? 0;
          if (allNotes.length >= totalCount) {
            hasMore = false;
          }
        }
      }

      const csvContent = convertNotesToCSV(allNotes);
      const filename = `${config.filenamePrefix}-${new Date().toISOString().split("T")[0]}.csv`;
      downloadCSV(csvContent, filename);

      showFlag({
        id: "exportSuccess",
        title: "Export completed",
        description: `Exported ${allNotes.length} records to ${filename}`,
        type: "success",
        appearance: "success",
        isAutoDismiss: true,
      });
    } catch (error: any) {
      console.error("Error exporting data:", error);
      showFlag({
        id: "exportError",
        title: "Export failed",
        description: error.message ?? "Failed to export data",
        type: "error",
        appearance: "error",
        isAutoDismiss: true,
      });
    }
  };

  return { exportNotes };
};
