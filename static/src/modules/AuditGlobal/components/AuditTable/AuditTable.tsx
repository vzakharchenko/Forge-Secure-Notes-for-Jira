// libs
import React, { useMemo, useState, useEffect, useCallback } from "react";

// helpers
import { formatDateWithTimezoneAndFormat } from "@src/shared/utils/date";
import { getStatusHistory, getStatusDescription, openIssueModal } from "./helpers";
import { useExportNotes } from "./hooks/useExportNotes";

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
import DynamicTable from "@atlaskit/dynamic-table";
import type { HeadType, RowType } from "@atlaskit/dynamic-table/types";
import Pagination from "@atlaskit/pagination";
import { token } from "@atlaskit/tokens";
import { Stack } from "@atlaskit/primitives";
import JiraUserTile from "@src/components/JiraUserTile";

interface TableTreeItem {
  id: string;
  note: ViewMySecurityNotes;
  history?: StatusHistoryItem[];
  children?: TableTreeItem[];
}

const AuditTable = ({
  fetchData,
  exportConfig,
  showProjectKey = true,
  showIssueKey = true,
  timezone,
  itemsPerPage = 10,
  onExportReady,
  showExportInTable = true,
}: AuditTableProps) => {
  const [notes, setNotes] = useState<ViewMySecurityNotes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { exportNotes } = useExportNotes();

  useEffect(() => {
    loadData(0);
  }, []);

  const loadData = async (offset: number) => {
    setIsLoading(true);
    try {
      const result = await fetchData(offset, itemsPerPage);
      setNotes(result.notes);
      setTotalCount(result.totalCount);
      setCurrentPage(Math.floor(offset / itemsPerPage));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    loadData(newPage * itemsPerPage);
  };

  const handleExport = useCallback(() => {
    if (exportConfig) {
      exportNotes(exportConfig);
    }
  }, [exportConfig, exportNotes]);

  useEffect(() => {
    if (onExportReady && exportConfig) {
      onExportReady(handleExport);
    }
  }, [onExportReady, exportConfig]);

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

      return {
        id: note.id,
        note: note,
        history: history,
        children:
          history.length > 0
            ? [{ id: `${note.id}-history`, note: note, history: history }]
            : undefined,
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
      <Box style={{ overflowX: "auto", width: "100%", position: "relative" }}>
        {isLoading && notes.length > 0 && (
          <Box
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(2px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              borderRadius: "3px",
            }}
          >
            <Stack space="space.200" alignInline="center">
              <Spinner size="medium" />
              <Text>Loading audit data...</Text>
            </Stack>
          </Box>
        )}
        <Box style={{ minWidth: `${minTableWidth}px` }}>
          <TableTree label="Security notes audit table">
            <Headers>{headers}</Headers>
            <Rows
              items={treeItems}
              render={({ id, note, history, children }) => {
                // Check if this is a history child row
                if (id.includes("-history") && history) {
                  // Render custom child - internal table for status history
                  const historyCells = headers.map((header, index) => {
                    if (index === 0) {
                      // First cell contains the nested table
                      return (
                        <Cell key={`history-${index}`}>
                          <Box
                            padding="space.200"
                            style={{
                              width: "100%",
                              marginLeft: "-8px",
                              marginRight: "-8px",
                            }}
                          >
                            {(() => {
                              const historyHead: HeadType = {
                                cells: [
                                  {
                                    key: "triggeredBy",
                                    content: "Triggered By",
                                    isSortable: false,
                                  },
                                  { key: "status", content: "Status", isSortable: false },
                                  { key: "action", content: "Action Name", isSortable: false },
                                  { key: "when", content: "Date", isSortable: false },
                                ],
                              };

                              const historyRows: RowType[] = history.map((historyItem, idx) => {
                                const triggeredBy =
                                  historyItem.status === "CREATED" ||
                                  historyItem.status === "DELETED"
                                    ? note.createdBy
                                    : historyItem.status === "VIEWED"
                                      ? note.targetUser
                                      : null;

                                return {
                                  key: `${id}-item-${idx}`,
                                  cells: [
                                    {
                                      key: "triggeredBy",
                                      content: triggeredBy ? (
                                        <Box style={{ maxWidth: "190px", wordBreak: "break-word" }}>
                                          <JiraUserTile
                                            avatarUrl={triggeredBy.avatarUrl}
                                            displayName={triggeredBy.displayName}
                                          />
                                        </Box>
                                      ) : (
                                        <Text>-</Text>
                                      ),
                                    },
                                    {
                                      key: "status",
                                      content: (
                                        <Box
                                          style={{
                                            minWidth: "90px",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
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
                                      ),
                                    },
                                    {
                                      key: "action",
                                      content: (
                                        <Box style={{ minWidth: "390px", wordBreak: "break-word" }}>
                                          <Text>{getStatusDescription(historyItem.status)}</Text>
                                        </Box>
                                      ),
                                    },
                                    {
                                      key: "when",
                                      content: (
                                        <Box
                                          style={{
                                            minWidth: "140px",
                                            maxWidth: "140px",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          {formatDateWithTimezoneAndFormat(
                                            historyItem.date,
                                            timezone,
                                          )}
                                        </Box>
                                      ),
                                    },
                                  ],
                                };
                              });

                              return (
                                <DynamicTable
                                  head={historyHead}
                                  rows={historyRows}
                                  label="Status history table"
                                />
                              );
                            })()}
                          </Box>
                        </Cell>
                      );
                    }
                    // Empty cells for other columns
                    return (
                      <Cell key={`history-${index}`}>
                        <Box></Box>
                      </Cell>
                    );
                  });

                  return (
                    <Row itemId={id} hasChildren={false}>
                      {historyCells}
                    </Row>
                  );
                }

                // Main note row
                const hasHistory = history && history.length > 0;
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
          {showExportInTable && exportConfig && (
            <Button appearance="default" onClick={handleExport}>
              Export CSV
            </Button>
          )}
          {totalPages > 1 && (
            <Pagination
              pages={Array.from({ length: totalPages }, (_, i) => i)}
              selectedIndex={currentPage}
              onChange={(event, pageIndex) => handlePageChange(pageIndex as number)}
              getPageLabel={(page) => (page as number) + 1}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default AuditTable;
