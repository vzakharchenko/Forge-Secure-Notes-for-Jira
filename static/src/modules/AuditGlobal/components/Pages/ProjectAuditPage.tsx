// libs
import React, { useCallback, useState } from "react";

// helpers
import { invoke, showFlag } from "@forge/bridge";

// models
import { ResolverNames } from "@shared/ResolverNames";
import { AuditUser } from "@shared/responses/AuditUser";

// components
import { Box, Stack } from "@atlaskit/primitives";
import Button from "@atlaskit/button/new";
import AiAgentIcon from "@atlaskit/icon/core/ai-agent";
import { token } from "@atlaskit/tokens";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageHeader from "@src/modules/AuditGlobal/components/PageHeader/PageHeader";
import AuditTable from "@src/modules/AuditGlobal/components/AuditTable/AuditTable";
import { useRovoAgent } from "../AuditTable/hooks/useRovoAgent";

export default function ProjectAuditPage(props: { timezone: string }) {
  const { projectKey: projectKeyFromParams } = useParams<{ projectKey: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { rovoAgent } = useRovoAgent();
  const { timezone } = props;
  const [exportFn, setExportFn] = useState<(() => void) | null>(null);

  // Extract projectKey from URL if useParams doesn't work
  const projectKeyMatch = location.pathname.match(/\/project\/([^/]+)/);
  const projectKey = projectKeyFromParams || (projectKeyMatch ? projectKeyMatch[1] : null);

  const fetchData = useCallback(
    async (offset: number, limit: number) => {
      if (!projectKey) {
        return { notes: [], totalCount: 0 };
      }

      const response = await invoke<AuditUser>(ResolverNames.AUDIT_DATA_PER_PROJECT, {
        projectId: projectKey,
        limit: limit,
        offset: offset,
      });

      if (response.isError) {
        showFlag({
          id: "loadProjectAudit",
          title: "Failed to load project audit",
          description: response.message ?? "Failed to load project audit",
          type: "error",
          appearance: "error",
          isAutoDismiss: true,
        });
        return { notes: [], totalCount: 0 };
      }

      return {
        notes: response.result ?? [],
        totalCount: response.result?.[0]?.count ?? 0,
      };
    },
    [projectKey],
  );

  const handleExportReady = useCallback((fn: () => void) => {
    setExportFn(() => fn);
  }, []);

  const exportConfig = projectKey
    ? {
        resolverName: ResolverNames.AUDIT_DATA_PER_PROJECT,
        params: { projectId: projectKey },
        filenamePrefix: `project-${projectKey}`,
      }
    : undefined;
  const handleRovoAgent = useCallback(() => {
    if (exportConfig) {
      rovoAgent(exportConfig);
    }
  }, []);
  return (
    <Box padding="space.400">
      <Stack space="space.400">
        <PageHeader
          title={`Project Audit: ${projectKey}`}
          actions={
            <Box style={{ display: "flex", gap: token("space.150", "8px"), alignItems: "center" }}>
              {exportFn && (
                <Box
                  style={{ display: "flex", gap: token("space.050", "4px"), alignItems: "center" }}
                >
                  <Button appearance="default" onClick={exportFn}>
                    Export CSV
                  </Button>
                  <Button iconBefore={AiAgentIcon} appearance="default" onClick={handleRovoAgent}>
                    Ask Rovo
                  </Button>
                </Box>
              )}
              <Button onClick={() => navigate("../myProject")}>Back to projects</Button>
            </Box>
          }
        />
        <AuditTable
          fetchData={fetchData}
          exportConfig={exportConfig}
          showProjectKey={false}
          showIssueKey={true}
          timezone={timezone}
          onExportReady={handleExportReady}
          showExportInTable={false}
        />
      </Stack>
    </Box>
  );
}
