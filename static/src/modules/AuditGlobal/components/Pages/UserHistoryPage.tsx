// libs
import React, { useEffect, useState, useCallback } from "react";

// helpers
import { invoke, showFlag } from "@forge/bridge";

// models
import { ResolverNames } from "@shared/ResolverNames";
import { AuditUsers } from "@shared/responses/AuditUsers";
import { AuditUser } from "@shared/responses/AuditUser";
import { UserViewInfoType } from "@shared/responses/ViewMySecurityNotes";

// components
import { Box, Stack, Text } from "@atlaskit/primitives";
import Button from "@atlaskit/button/new";
import Spinner from "@atlaskit/spinner";
import { token } from "@atlaskit/tokens";
import { useLocation } from "react-router-dom";
import PageHeader from "@src/modules/AuditGlobal/components/PageHeader/PageHeader";
import Table, { THead, TBody, Row, Cell, HeadCell } from "@atlaskit/table";
import AuditTable from "@src/modules/AuditGlobal/components/AuditTable/AuditTable";

export default function UserHistoryPage(props: { timezone: string }) {
  const { timezone } = props;
  const location = useLocation();
  const [users, setUsers] = useState<UserViewInfoType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserViewInfoType | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
    setSelectedUser(null);
  }, [location.pathname]);

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

  const fetchUserNotes = useCallback(
    async (offset: number, limit: number) => {
      if (!selectedUser) {
        return { notes: [], totalCount: 0 };
      }

      const response = await invoke<AuditUser>(ResolverNames.AUDIT_DATA_PER_USER, {
        accountId: selectedUser.accountId,
        limit: limit,
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
        return { notes: [], totalCount: 0 };
      }

      return {
        notes: response.result ?? [],
        totalCount: response.result?.[0]?.count ?? 0,
      };
    },
    [selectedUser],
  );

  const handleUserClick = (user: UserViewInfoType) => {
    setSelectedUser(user);
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
        <PageHeader title="User History" />
        {!selectedUser ? (
          <>
            {users.length === 0 ? (
              <Box
                padding="space.400"
                style={{
                  background: token("elevation.surface.sunken", "#DFE1E6"),
                  borderRadius: "3px",
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
                          View history
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
            <PageHeader
              title={`History for: ${selectedUser.displayName}`}
              actions={<Button onClick={() => setSelectedUser(null)}>Back to users</Button>}
            />
            <AuditTable
              fetchData={fetchUserNotes}
              exportConfig={{
                resolverName: ResolverNames.AUDIT_DATA_PER_USER,
                params: { accountId: selectedUser.accountId },
                filenamePrefix: `user-${selectedUser.accountId}`,
              }}
              showProjectKey={true}
              showIssueKey={true}
              timezone={timezone}
            />
          </>
        )}
      </Stack>
    </Box>
  );
}
