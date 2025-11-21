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
import { token } from "@atlaskit/tokens";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageHeader from "@src/modules/AuditGlobal/components/PageHeader/PageHeader";
import AuditTable from "@src/modules/AuditGlobal/components/AuditTable/AuditTable";

export default function IssueAuditPage(props: { timezone: string }) {
  const { issueKey: issueKeyFromParams } = useParams<{ issueKey: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { timezone } = props;
  const [exportFn, setExportFn] = useState<(() => void) | null>(null);

  // Extract issueKey from URL if useParams doesn't work
  const issueKeyMatch = location.pathname.match(/\/issue\/([^/]+)/);
  const issueKey = issueKeyFromParams || (issueKeyMatch ? issueKeyMatch[1] : null);

  const fetchData = useCallback(
    async (offset: number, limit: number) => {
      if (!issueKey) {
        return { notes: [], totalCount: 0 };
      }

      const response = await invoke<AuditUser>(ResolverNames.AUDIT_DATA_PER_ISSUE, {
        issueId: issueKey,
        limit: limit,
        offset: offset,
      });

      if (response.isError) {
        showFlag({
          id: "loadIssueAudit",
          title: "Failed to load issue audit",
          description: response.message ?? "Failed to load issue audit",
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
    [issueKey],
  );

  const handleExportReady = useCallback((fn: () => void) => {
    setExportFn(() => fn);
  }, []);

  return (
    <Box padding="space.400">
      <Stack space="space.400">
        <PageHeader
          title={`Issue Audit: ${issueKey}`}
          actions={
            <Box style={{ display: "flex", gap: token("space.100", "8px"), alignItems: "center" }}>
              {exportFn && (
                <Button appearance="default" onClick={exportFn}>
                  Export CSV
                </Button>
              )}
              <Button onClick={() => navigate("..")}>Back to issues</Button>
            </Box>
          }
        />
        <AuditTable
          fetchData={fetchData}
          exportConfig={
            issueKey
              ? {
                  resolverName: ResolverNames.AUDIT_DATA_PER_ISSUE,
                  params: { issueId: issueKey },
                  filenamePrefix: `issue-${issueKey}`,
                }
              : undefined
          }
          showProjectKey={false}
          showIssueKey={false}
          timezone={timezone}
          onExportReady={handleExportReady}
          showExportInTable={false}
        />
      </Stack>
    </Box>
  );
}
