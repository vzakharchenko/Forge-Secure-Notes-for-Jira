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
import PageHeader from "@src/modules/AuditGlobal/components/PageHeader/PageHeader";
import AuditTable from "@src/modules/AuditGlobal/components/AuditTable/AuditTable";

export default function MyHistoryPage(props: { timezone: string }) {
  const { timezone } = props;
  const [exportFn, setExportFn] = useState<(() => void) | null>(null);

  const fetchData = useCallback(async (offset: number, limit: number) => {
    const response = await invoke<AuditUser>(ResolverNames.AUDIT_DATA_PER_USER, {
      limit: limit,
      offset: offset,
    });

    if (response.isError) {
      showFlag({
        id: "loadHistory",
        title: "Failed to load history",
        description: response.message ?? "Failed to load history",
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
  }, []);

  const handleExportReady = useCallback((fn: () => void) => {
    setExportFn(() => fn);
  }, []);

  return (
    <Box padding="space.400">
      <Stack space="space.400">
        <PageHeader
          title="My History"
          actions={
            exportFn && (
              <Button appearance="default" onClick={exportFn}>
                Export CSV
              </Button>
            )
          }
        />
        <AuditTable
          fetchData={fetchData}
          exportConfig={{
            resolverName: ResolverNames.AUDIT_DATA_PER_USER,
            params: {},
            filenamePrefix: "my-history",
          }}
          showProjectKey={true}
          showIssueKey={true}
          timezone={timezone}
          onExportReady={handleExportReady}
          showExportInTable={false}
        />
      </Stack>
    </Box>
  );
}
