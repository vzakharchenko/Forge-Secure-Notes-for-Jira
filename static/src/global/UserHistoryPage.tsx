import React, { useEffect, useState } from "react";
import { Box, Stack, Text } from "@atlaskit/primitives";
import Button from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import { invoke, showFlag } from "@forge/bridge";
import { token } from "@atlaskit/tokens";
import { ResolverNames } from "../../../shared/ResolverNames";
import { AuditUsers } from "../../../shared/responses/AuditUsers";
import { AuditUser } from "../../../shared/responses/AuditUser";
import { ViewMySecurityNotes } from "../../../shared/responses/ViewMySecurityNotes";
import { UserViewInfoType } from "../../../shared/responses/ViewMySecurityNotes";
import { formatDateTime } from "../utils/dateUtils";
import Lozenge from "@atlaskit/lozenge";
import Table, { THead, TBody, Row, Cell, HeadCell } from "@atlaskit/table";
import { useLocation } from "react-router-dom";
import { convertNotesToCSV, downloadCSV } from "../utils/csvUtils";

const ITEMS_PER_PAGE = 10;

export default function UserHistoryPage() {
  const location = useLocation();
  const [users, setUsers] = useState<UserViewInfoType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserViewInfoType | null>(null);
  const [userNotes, setUserNotes] = useState<ViewMySecurityNotes[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchUsers();
    setSelectedUser(null);
    setUserNotes([]);
  }, [location.pathname]);

  useEffect(() => {
    if (selectedUser) {
      fetchUserNotes(0);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await invoke<AuditUsers>(ResolverNames.AUDIT_USERS_ALL);

      if (response.isError) {
        showFlag({
          id: "loadUsers",
          title: "Failed to load users",
          description: response.message ?? "Failed to load users",
          type: "error",
          appearance: "error",
          isAutoDismiss: true,
        });
        return;
      }

      setUsers(response.result ?? []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      showFlag({
        id: "loadUsers",
        title: "Failed to load users",
        description: error.message ?? "Failed to load users",
        type: "error",
        appearance: "error",
        isAutoDismiss: true,
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchUserNotes = async (offset: number) => {
    if (!selectedUser) return;

    setIsLoadingNotes(true);
    try {
      const response = await invoke<AuditUser>(ResolverNames.AUDIT_DATA_PER_USER, {
        accountId: selectedUser.accountId,
        limit: ITEMS_PER_PAGE,
        offset: offset,
      });

      if (response.isError) {
        showFlag({
          id: "loadUserNotes",
          title: "Failed to load user notes",
          description: response.message ?? "Failed to load user notes",
          type: "error",
          appearance: "error",
          isAutoDismiss: true,
        });
        return;
      }

      setUserNotes(response.result ?? []);
      setTotalCount(response.result?.[0]?.count ?? 0);
      setCurrentPage(Math.floor(offset / ITEMS_PER_PAGE));
    } catch (error: any) {
      console.error("Error fetching user notes:", error);
      showFlag({
        id: "loadUserNotes",
        title: "Failed to load user notes",
        description: error.message ?? "Failed to load user notes",
        type: "error",
        appearance: "error",
        isAutoDismiss: true,
      });
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleUserClick = (user: UserViewInfoType) => {
    setSelectedUser(user);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    fetchUserNotes(newPage * ITEMS_PER_PAGE);
  };

  const handleExport = async () => {
    if (!selectedUser) return;

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
        const response = await invoke<AuditUser>(ResolverNames.AUDIT_DATA_PER_USER, {
          accountId: selectedUser.accountId,
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
      const filename = `user-${selectedUser.accountId}-${new Date().toISOString().split("T")[0]}.csv`;
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

  if (isLoadingUsers) {
    return (
      <Box padding="space.400" style={{ textAlign: "center" }}>
        <Stack space="space.400" alignInline="center">
          <Spinner size="large" />
          <Text>Loading users...</Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box padding="space.400">
      <Stack space="space.400">
        <Text size="large" weight="bold">
          User History
        </Text>
        {!selectedUser ? (
          <>
            {users.length === 0 ? (
              <Box
                padding="space.400"
                style={{
                  background: token("elevation.surface.sunken", "#DFE1E6"),
                  borderRadius: token("border.radius.200", "3px"),
                  textAlign: "center",
                }}
              >
                <Text>No users found</Text>
              </Box>
            ) : (
              <Table>
                <THead>
                  <HeadCell>Display Name</HeadCell>
                  <HeadCell>Account ID</HeadCell>
                  <HeadCell>Actions</HeadCell>
                </THead>
                <TBody>
                  {users.map((user) => (
                    <Row key={user.accountId}>
                      <Cell>{user.displayName}</Cell>
                      <Cell>{user.accountId}</Cell>
                      <Cell>
                        <Button appearance="primary" onClick={() => handleUserClick(user)}>
                          View History
                        </Button>
                      </Cell>
                    </Row>
                  ))}
                </TBody>
              </Table>
            )}
          </>
        ) : (
          <>
            <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text size="large" weight="bold">
                History for: {selectedUser.displayName}
              </Text>
              <Box style={{ display: "flex", gap: token("space.100", "8px") }}>
                {userNotes.length > 0 && (
                  <Button appearance="default" onClick={handleExport}>
                    Export CSV
                  </Button>
                )}
                <Button onClick={() => setSelectedUser(null)}>Back to Users</Button>
              </Box>
            </Box>
            {isLoadingNotes && userNotes.length === 0 ? (
              <Box padding="space.400" style={{ textAlign: "center" }}>
                <Stack space="space.400" alignInline="center">
                  <Spinner size="large" />
                  <Text>Loading user history...</Text>
                </Stack>
              </Box>
            ) : userNotes.length === 0 ? (
              <Box
                padding="space.400"
                style={{
                  background: token("elevation.surface.sunken", "#DFE1E6"),
                  borderRadius: token("border.radius.200", "3px"),
                  textAlign: "center",
                }}
              >
                <Text>No history found for this user</Text>
              </Box>
            ) : (
              <>
                <Table>
                  <THead>
                    <HeadCell></HeadCell>
                    <HeadCell>ID</HeadCell>
                    <HeadCell>Created By</HeadCell>
                    <HeadCell>Target User</HeadCell>
                    <HeadCell>Status</HeadCell>
                    <HeadCell>Issue Key</HeadCell>
                    <HeadCell>Project Key</HeadCell>
                    <HeadCell>Created At</HeadCell>
                    <HeadCell>Expiration</HeadCell>
                  </THead>
                  <TBody>
                    {userNotes.flatMap((note) => {
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
                                style={{
                                  padding: 0,
                                  minWidth: "auto",
                                  width: "24px",
                                  height: "24px",
                                }}
                              >
                                {isExpanded ? "▼" : "▶"}
                              </Button>
                            )}
                          </Cell>
                          <Cell>{note.id.substring(0, 8)}...</Cell>
                          <Cell>{note.createdBy.displayName}</Cell>
                          <Cell>{note.targetUser.displayName}</Cell>
                          <Cell>
                            <Lozenge appearance={note.status === "NEW" ? "new" : "success"}>
                              {note.status}
                            </Lozenge>
                          </Cell>
                          <Cell>{note.issueKey ?? "-"}</Cell>
                          <Cell>{note.projectKey ?? "-"}</Cell>
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
                              <Cell></Cell>
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
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
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
          </>
        )}
      </Stack>
    </Box>
  );
}
