import React, { useEffect, useState } from "react";
import { Box, Stack, Text } from "@atlaskit/primitives";
import Button from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import { invoke, showFlag } from "@forge/bridge";
import { token } from "@atlaskit/tokens";
import { ResolverNames } from "../../../shared/ResolverNames";
import { AuditUser } from "../../../shared/responses/AuditUser";
import { ViewMySecurityNotes } from "../../../shared/responses/ViewMySecurityNotes";
import { formatDateTime } from "../utils/dateUtils";
import Lozenge from "@atlaskit/lozenge";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Table, { THead, TBody, Row, Cell, HeadCell } from "@atlaskit/table";
import { convertNotesToCSV, downloadCSV } from "../utils/csvUtils";

const ITEMS_PER_PAGE = 10;

export default function IssueAuditPage() {
  const { issueKey: issueKeyFromParams } = useParams<{ issueKey: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract issueKey from URL if useParams doesn't work
  const issueKeyMatch = location.pathname.match(/\/issue\/([^/]+)/);
  const issueKey = issueKeyFromParams || (issueKeyMatch ? issueKeyMatch[1] : null);
  const [notes, setNotes] = useState<ViewMySecurityNotes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (issueKey) {
      fetchNotes(0);
    }
  }, [issueKey]);

  const fetchNotes = async (offset: number) => {
    if (!issueKey) return;

    setIsLoading(true);
    try {
      const response = await invoke<AuditUser>(ResolverNames.AUDIT_DATA_PER_ISSUE, {
        issueId: issueKey,
        limit: ITEMS_PER_PAGE,
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
        return;
      }

      setNotes(response.result ?? []);
      setTotalCount(response.result?.[0]?.count ?? 0);
      setCurrentPage(Math.floor(offset / ITEMS_PER_PAGE));
    } catch (error: any) {
      console.error("Error fetching issue audit:", error);
      showFlag({
        id: "loadIssueAudit",
        title: "Failed to load issue audit",
        description: error.message ?? "Failed to load issue audit",
        type: "error",
        appearance: "error",
        isAutoDismiss: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchNotes(newPage * ITEMS_PER_PAGE);
  };

  const handleExport = async () => {
    if (!issueKey) return;

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
        const response = await invoke<AuditUser>(ResolverNames.AUDIT_DATA_PER_ISSUE, {
          issueId: issueKey,
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
      const filename = `issue-${issueKey}-${new Date().toISOString().split("T")[0]}.csv`;
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

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const getStatusHistory = (note: ViewMySecurityNotes): Array<{ status: string; date: Date }> => {
    const history: Array<{ status: string; date: Date }> = [];

    if (note.createdAt) {
      history.push({ status: "CREATED", date: note.createdAt });
    }

    if (note.viewedAt) {
      history.push({ status: "VIEWED", date: note.viewedAt });
    }

    if (note.deletedAt) {
      history.push({ status: "DELETED", date: note.deletedAt });
    }

    if (note.status === "EXPIRED") {
      history.push({ status: "EXPIRED", date: note.expiration });
    }

    return history;
  };

  const toggleExpand = (noteId: string) => {
    setExpandedNotes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  if (isLoading && notes.length === 0) {
    return (
      <Box padding="space.400" style={{ textAlign: "center" }}>
        <Stack space="space.400" alignInline="center">
          <Spinner size="large" />
          <Text>Loading issue audit...</Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box padding="space.400">
      <Stack space="space.400">
        <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text size="large" weight="bold">
            Issue Audit: {issueKey}
          </Text>
          <Box style={{ display: "flex", gap: token("space.100", "8px") }}>
            {notes.length > 0 && (
              <Button appearance="default" onClick={handleExport}>
                Export CSV
              </Button>
            )}
            <Button onClick={() => navigate("..")}>Back to Issues</Button>
          </Box>
        </Box>
        {notes.length === 0 ? (
          <Box
            padding="space.400"
            style={{
              background: token("elevation.surface.sunken", "#DFE1E6"),
              borderRadius: "3px",
              textAlign: "center",
            }}
          >
            <Text>No audit data found for this issue</Text>
          </Box>
        ) : (
          <>
            <Table>
              <THead>
                <HeadCell></HeadCell>
                <HeadCell>ID</HeadCell>
                <HeadCell>Description</HeadCell>
                <HeadCell>Created By</HeadCell>
                <HeadCell>Target User</HeadCell>
                <HeadCell>Status</HeadCell>
                <HeadCell>Created At</HeadCell>
                <HeadCell>Expiration</HeadCell>
              </THead>
              <TBody>
                {notes.flatMap((note) => {
                  const history = getStatusHistory(note);
                  const isExpanded = expandedNotes.has(note.id);
                  const hasHistory = history.length > 0;

                  const rows = [
                    <Row key={note.id}>
                      <Cell>
                        {hasHistory && (
                          <Button
                            appearance="subtle"
                            onClick={() => toggleExpand(note.id)}
                            style={{ padding: 0, minWidth: "auto", width: "24px", height: "24px" }}
                          >
                            {isExpanded ? "▼" : "▶"}
                          </Button>
                        )}
                      </Cell>
                      <Cell>{note.id.substring(0, 8)}...</Cell>
                      <Cell>
                        <Box
                          style={{ minWidth: "150px", maxWidth: "300px", wordBreak: "break-word" }}
                        >
                          <Text>{note.description ?? "-"}</Text>
                        </Box>
                      </Cell>
                      <Cell>{note.createdBy.displayName}</Cell>
                      <Cell>{note.targetUser.displayName}</Cell>
                      <Cell>
                        <Lozenge appearance={note.status === "NEW" ? "new" : "success"}>
                          {note.status}
                        </Lozenge>
                      </Cell>
                      <Cell>{formatDateTime(note.createdAt)}</Cell>
                      <Cell>{formatDateTime(note.expiration)}</Cell>
                    </Row>,
                  ];

                  if (isExpanded && hasHistory) {
                    history.forEach((historyItem, index) => {
                      rows.push(
                        <Row key={`${note.id}-history-${index}`}>
                          <Cell></Cell>
                          <Cell></Cell>
                          <Cell></Cell>
                          <Cell></Cell>
                          <Cell></Cell>
                          <Cell>
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
                          </Cell>
                          <Cell></Cell>
                          <Cell>{formatDateTime(historyItem.date)}</Cell>
                        </Row>,
                      );
                    });
                  }

                  return rows;
                })}
              </TBody>
            </Table>
            <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text>
                Showing {currentPage * ITEMS_PER_PAGE + 1} -{" "}
                {Math.min((currentPage + 1) * ITEMS_PER_PAGE, totalCount)} of {totalCount}
              </Text>
              <Box style={{ display: "flex", gap: token("space.100", "8px") }}>
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage >= totalPages - 1}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
}
