// libs
import React, { useMemo } from "react";

// helpers
import { formatDateWithTimezoneAndFormat } from "@src/shared/utils/date";
import { getStatusHistory, getStatusDescription, openIssueModal } from "./helpers";

// models
import { AuditTableProps } from "./models";
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";
import { StatusHistoryItem } from "./models";

// components
import { Box, Text } from "@atlaskit/primitives";
import Button from "@atlaskit/button/new";
import Spinner from "@atlaskit/spinner";
import Lozenge from "@atlaskit/lozenge";
import TableTree, { Headers, Header, Rows, Row, Cell } from "@atlaskit/table-tree";
import Pagination from "@atlaskit/pagination";
import { token } from "@atlaskit/tokens";
import { Stack } from "@atlaskit/primitives";
import JiraUserTile from "@src/components/JiraUserTile";

interface TableTreeItem {
  id: string;
  note: ViewMySecurityNotes;
  historyItem?: StatusHistoryItem;
  children?: TableTreeItem[];
}

const AuditTable = ({
  notes,
  isLoading,
  currentPage,
  totalCount,
  itemsPerPage,
  onPageChange,
  onExport,
  showProjectKey = true,
  showIssueKey = true,
  timezone,
}: AuditTableProps) => {
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // All hooks must be called before any conditional returns
  // Calculate minimum table width based on column widths
  const minTableWidth = useMemo(() => {
    let width = 50; // expand column
    width += 100; // ID
    width += 200; // Description
    width += 200; // Created By
    width += 200; // Target User
    width += 100; // Status
    if (showIssueKey) width += 120;
    if (showProjectKey) width += 120;
    width += 140; // Created At
    width += 140; // Expiration
    return width;
  }, [showIssueKey, showProjectKey]);

  // Headers memoization
  const headers = useMemo(() => {
    const headerList = [
      <Header key="expand" width={50}></Header>,
      <Header key="id" width={100}>
        ID
      </Header>,
      <Header key="description" width={200}>
        Description
      </Header>,
      <Header key="createdBy" width={200}>
        Created By
      </Header>,
      <Header key="targetUser" width={200}>
        Target User
      </Header>,
      <Header key="status" width={100}>
        Status
      </Header>,
    ];

    if (showIssueKey) {
      headerList.push(
        <Header key="issueKey" width={120}>
          Issue Key
        </Header>,
      );
    }

    if (showProjectKey) {
      headerList.push(
        <Header key="projectKey" width={120}>
          Project Key
        </Header>,
      );
    }

    headerList.push(
      <Header key="createdAt" width={140}>
        Created At
      </Header>,
      <Header key="expiration" width={140}>
        Expiration
      </Header>,
    );

    return headerList;
  }, [showIssueKey, showProjectKey]);

  // Transform notes into tree structure for TableTree
  const treeItems = useMemo<TableTreeItem[]>(() => {
    return notes.map((note) => {
      const history = getStatusHistory(note);
      const children: TableTreeItem[] | undefined =
        history.length > 0
          ? history.map((historyItem, index) => ({
              id: `${note.id}-history-${index}`,
              note: note,
              historyItem: historyItem,
            }))
          : undefined;

      return {
        id: note.id,
        note: note,
        children: children,
      };
    });
  }, [notes]);

  // Conditional returns after all hooks
  if (isLoading && notes.length === 0) {
    return (
      <Box padding="space.400" style={{ textAlign: "center" }}>
        <Stack space="space.400" alignInline="center">
          <Spinner size="large" />
          <Text>Loading audit data...</Text>
        </Stack>
      </Box>
    );
  }

  if (notes.length === 0) {
    return (
      <Box
        padding="space.400"
        style={{
          background: token("elevation.surface.sunken", "#DFE1E6"),
          borderRadius: "3px",
          textAlign: "center",
        }}
      >
        <Text>No audit data found</Text>
      </Box>
    );
  }

  return (
    <>
      <Box style={{ overflowX: "auto", width: "100%" }}>
        <Box style={{ minWidth: `${minTableWidth}px` }}>
          <TableTree label="Security notes audit table">
            <Headers>{headers}</Headers>
            <Rows
              items={treeItems}
              render={({ id, note, historyItem, children }) => {
                // If this is a history row (has historyItem), render it differently
                if (historyItem) {
                  const historyCells = [
                    <Cell key="expand">
                      <Box></Box>
                    </Cell>,
                    <Cell key="id">
                      <Box></Box>
                    </Cell>,
                    <Cell key="description">
                      <Box style={{ minWidth: "190px", wordBreak: "break-word" }}>
                        <Text>{getStatusDescription(historyItem.status)}</Text>
                      </Box>
                    </Cell>,
                    <Cell key="createdBy">
                      {historyItem.status === "CREATED" || historyItem.status === "DELETED" ? (
                        <Box style={{ maxWidth: "190px", wordBreak: "break-word" }}>
                          <JiraUserTile
                            avatarUrl={note.createdBy.avatarUrl}
                            displayName={note.createdBy.displayName}
                          />
                        </Box>
                      ) : (
                        <Box></Box>
                      )}
                    </Cell>,
                    <Cell key="targetUser">
                      {historyItem.status === "VIEWED" ? (
                        <Box style={{ maxWidth: "190px", wordBreak: "break-word" }}>
                          <JiraUserTile
                            avatarUrl={note.targetUser.avatarUrl}
                            displayName={note.targetUser.displayName}
                          />
                        </Box>
                      ) : (
                        <Box></Box>
                      )}
                    </Cell>,
                    <Cell key="status">
                      <Box style={{ minWidth: "90px", display: "flex", alignItems: "center" }}>
                        <Lozenge
                          appearance={
                            historyItem.status === "CREATED"
                              ? "new"
                              : historyItem.status === "VIEWED"
                                ? "success"
                                : historyItem.status === "DELETED"
                                  ? "removed"
                                  : "moved"
                          }
                        >
                          {historyItem.status}
                        </Lozenge>
                      </Box>
                    </Cell>,
                  ];

                  if (showIssueKey) {
                    historyCells.push(
                      <Cell key="issueKey">
                        <Box></Box>
                      </Cell>,
                    );
                  }

                  if (showProjectKey) {
                    historyCells.push(
                      <Cell key="projectKey">
                        <Box></Box>
                      </Cell>,
                    );
                  }

                  historyCells.push(
                    <Cell key="createdAt">
                      <Box
                        style={{
                          minWidth: "120px",
                          maxWidth: "120px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {formatDateWithTimezoneAndFormat(historyItem.date, timezone)}
                      </Box>
                    </Cell>,
                    <Cell key="expiration">
                      <Box></Box>
                    </Cell>,
                  );

                  return (
                    <Row itemId={id} hasChildren={false}>
                      {historyCells}
                    </Row>
                  );
                }

                // Main note row
                const hasHistory = children && children.length > 0;
                const mainCells = [
                  <Cell key="expand">
                    <Box></Box>
                  </Cell>,
                  <Cell key="id">
                    <Box style={{ minWidth: "90px", maxWidth: "300px", wordBreak: "break-word" }}>
                      <Text>{note.id.substring(0, 8)}...</Text>
                    </Box>
                  </Cell>,
                  <Cell key="description">
                    <Box style={{ minWidth: "190px", wordBreak: "break-word" }}>
                      <Text>{note.description ?? "-"}</Text>
                    </Box>
                  </Cell>,
                  <Cell key="createdBy">
                    <Box style={{ maxWidth: "190px", wordBreak: "break-word" }}>
                      <JiraUserTile
                        avatarUrl={note.createdBy.avatarUrl}
                        displayName={note.createdBy.displayName}
                      />
                    </Box>
                  </Cell>,
                  <Cell key="targetUser">
                    <Box style={{ minWidth: "190px", maxWidth: "190px", wordBreak: "break-word" }}>
                      <JiraUserTile
                        avatarUrl={note.targetUser.avatarUrl}
                        displayName={note.targetUser.displayName}
                      />
                    </Box>
                  </Cell>,
                  <Cell key="status">
                    <Box style={{ minWidth: "90px", display: "flex", alignItems: "center" }}>
                      <Lozenge appearance={note.status === "NEW" ? "new" : "success"}>
                        {note.status}
                      </Lozenge>
                    </Box>
                  </Cell>,
                ];

                if (showIssueKey) {
                  mainCells.push(
                    <Cell key="issueKey">
                      <Box
                        style={{
                          minWidth: "90px",
                          maxWidth: "100px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {note.issueKey ? (
                          <Box
                            onClick={() => openIssueModal(note.issueKey!)}
                            style={{
                              color: token("color.link", "#0052CC"),
                              cursor: "pointer",
                              textDecoration: "none",
                            }}
                            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                              e.currentTarget.style.textDecoration = "underline";
                            }}
                            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                              e.currentTarget.style.textDecoration = "none";
                            }}
                          >
                            <Text>{note.issueKey}</Text>
                          </Box>
                        ) : (
                          <Text>-</Text>
                        )}
                      </Box>
                    </Cell>,
                  );
                }

                if (showProjectKey) {
                  mainCells.push(
                    <Cell key="projectKey">
                      <Box
                        style={{
                          minWidth: "90px",
                          maxWidth: "100px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {note.projectKey ?? "-"}
                      </Box>
                    </Cell>,
                  );
                }

                mainCells.push(
                  <Cell key="createdAt">
                    <Box
                      style={{
                        minWidth: "120px",
                        maxWidth: "120px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {formatDateWithTimezoneAndFormat(note.createdAt, timezone)}
                    </Box>
                  </Cell>,
                  <Cell key="expiration">
                    <Box
                      style={{
                        minWidth: "120px",
                        maxWidth: "120px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {formatDateWithTimezoneAndFormat(note.expiration, timezone)}
                    </Box>
                  </Cell>,
                );

                return (
                  <Row
                    itemId={id}
                    items={children}
                    hasChildren={hasHistory}
                    expandLabel="Expand status history"
                    collapseLabel="Collapse status history"
                  >
                    {mainCells}
                  </Row>
                );
              }}
            />
          </TableTree>
        </Box>
      </Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: token("space.200", "16px"),
        }}
      >
        <Box style={{ display: "flex", gap: token("space.100", "8px"), alignItems: "center" }}>
          {onExport && (
            <Button appearance="default" onClick={onExport}>
              Export CSV
            </Button>
          )}
          {totalPages > 1 && (
            <Pagination
              pages={Array.from({ length: totalPages }, (_, i) => i)}
              selectedIndex={currentPage}
              onChange={(event, pageIndex) => onPageChange(pageIndex as number)}
              getPageLabel={(page) => (page as number) + 1}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default AuditTable;
