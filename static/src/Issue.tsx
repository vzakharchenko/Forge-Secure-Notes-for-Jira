import React, { useEffect, useState } from "react";
import { Box, Inline, Stack, Text } from "@atlaskit/primitives";
import Button, { ButtonGroup } from "@atlaskit/button";
import AddIcon from "@atlaskit/icon/glyph/add";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import OpenIcon from "@atlaskit/icon/glyph/open";
import Lozenge from "@atlaskit/lozenge";
import { token } from "@atlaskit/tokens";
import { formatDateTime } from "./utils/dateUtils";
import { showNewIssueModal } from "./utils/ModalUtils";
import { NoteDataType } from "./Types";
import Spinner from "@atlaskit/spinner";
import { invoke, router, showFlag } from "@forge/bridge";
import { ViewMySecurityNotes } from "../../shared/responses/ViewMySecurityNotes";
import { ResolverNames } from "../../shared/ResolverNames";
import { AuditUser } from "../../shared/responses/AuditUser";

function Issue(props: Readonly<{ accountId: string; appUrl: string }>) {
  const [notes, setNotes] = useState<ViewMySecurityNotes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserId = props.accountId;

  useEffect(() => {
    let intervalId: any | null = null;

    const fetchNotes = async (showSpinner: boolean = false) => {
      try {
        if (showSpinner) {
          setIsLoading(true);
        }

        let response = await invoke<AuditUser>(ResolverNames.GET_MY_SECURED_NOTES);

        while (response.isError && response.errorType === "INSTALLATION") {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          response = await invoke<AuditUser>(ResolverNames.GET_MY_SECURED_NOTES);
        }

        setNotes(response?.result ?? []);
      } catch (error: any) {
        console.error("Error fetching notes:", error);

        showFlag({
          id: "loadNote",
          title: "Failed to load Security Notes",
          description: "Load Security Notes are failed with error " + error.message,
          type: "error",
          appearance: "error",
          isAutoDismiss: true,
        });
      } finally {
        if (showSpinner) {
          setIsLoading(false);
        }
      }
    };

    // First load with spinner
    fetchNotes(true).catch(console.error);

    // Setup polling every 10 seconds without spinner
    intervalId = setInterval(() => {
      fetchNotes(false).catch(console.error);
    }, 10000);

    // Cleanup interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const incomingNotes = notes.filter((note) => note.targetUser.accountId === currentUserId);
  // const sentNotes = notes.filter(note => note.targetUser.accountId !== currentUserId);
  const sentNotes = notes.filter((note) => note.createdBy.accountId === currentUserId);

  const handleNewNote = async () => {
    await showNewIssueModal(async (noteDate?: NoteDataType) => {
      if (!noteDate) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await invoke<AuditUser>(ResolverNames.CREATE_SECURITY_NOTE, noteDate);
        setNotes(response?.result ?? []);
        showFlag({
          id: "newNote",
          title: "Security Note successfully created",
          description:
            "Security Note successfully created, remember send key over slack, telegram or etc...",
          type: "success",
          appearance: "success",
          isAutoDismiss: true,
        });
      } catch (error: any) {
        console.error("Error creating note:", error);
        showFlag({
          id: "newNote",
          title: "Failed to create Security Note",
          description: "creating Security Note is failed with error " + error.message,
          type: "error",
          appearance: "error",
          isAutoDismiss: true,
        });
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleOpenNote = async (noteId: string) => {
    await router.open(`/jira/apps/${props.appUrl}${noteId}`);
  };

  const handleDeleteNote = async (noteId: string) => {
    setIsLoading(true);
    try {
      const response = await invoke<AuditUser>(ResolverNames.DELETE_SECURITY_NOTE, { id: noteId });
      setNotes(response?.result ?? []);
      showFlag({
        id: "deleteNote",
        title: "Security Note successfully deleted",
        description: "Security Note successfully deleted, audit logs are still available",
        type: "success",
        appearance: "success",
        isAutoDismiss: true,
      });
    } catch (error: any) {
      console.error("Error deleted notes:", error);
      showFlag({
        id: "deleteNote",
        title: "Failed to delete Security Note",
        description: "Deleted Security Note is failed with error " + error.message,
        type: "error",
        appearance: "error",
        isAutoDismiss: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box padding="space.400" style={{ maxWidth: 600, margin: "32px auto", textAlign: "center" }}>
        <Stack space="space.400" alignInline="center">
          <Spinner size="large" />
          <Text>Loading secure notes...</Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box padding="space.400" style={{ maxWidth: 600, margin: "32px auto" }}>
      <Stack space="space.400">
        <Inline alignBlock="center" spread="space-between">
          <h2 style={{ margin: 0 }}>🔐 Secure Notes Panel</h2>
          <Button appearance="primary" iconBefore={<AddIcon label="Add" />} onClick={handleNewNote}>
            New Secure Note
          </Button>
        </Inline>
        {incomingNotes.length ? (
          <Box>
            <h3 style={{ margin: 0 }}>📬 Incoming Notes (to me)</h3>
            <Stack space="space.200">
              {incomingNotes.map((note) => (
                <Box
                  key={note.id}
                  padding="space.200"
                  style={{
                    background: token("elevation.surface.sunken", "#DFE1E6"),
                    borderRadius: 8,
                  }}
                >
                  <Inline spread="space-between" alignBlock="center">
                    <Inline space="space.200" alignBlock="center">
                      {note.status === "NEW" ? (
                        <Lozenge appearance="new">🕒 NEW</Lozenge>
                      ) : (
                        <Lozenge appearance="success">✅ VIEWED</Lozenge>
                      )}
                      <Text>From: {note.createdBy.displayName}</Text>
                      <Text>
                        (
                        {formatDateTime(
                          note.status === "NEW" ? note.expiration : (note.viewedAt as Date),
                        )}
                        )
                      </Text>
                    </Inline>
                    <ButtonGroup>
                      {note.status === "NEW" ? (
                        <Button
                          appearance="subtle"
                          iconBefore={<OpenIcon label="Open" />}
                          onClick={() => handleOpenNote(note.id)}
                        >
                          Open
                        </Button>
                      ) : null}
                    </ButtonGroup>
                  </Inline>
                </Box>
              ))}
            </Stack>
          </Box>
        ) : null}
        {sentNotes.length ? (
          <Box>
            <h3 style={{ margin: 0 }}>📤 Sent Notes (from me)</h3>
            <Stack space="space.200">
              {sentNotes.map((note) => (
                <Box
                  key={note.id}
                  padding="space.200"
                  style={{
                    background: token("elevation.surface.sunken", "#DFE1E6"),
                    borderRadius: 8,
                  }}
                >
                  <Inline spread="space-between" alignBlock="center">
                    <Inline space="space.200" alignBlock="center">
                      <Text>To: {note.targetUser.displayName}</Text>
                      <Text>
                        (
                        {formatDateTime(
                          note.status === "NEW" ? note.expiration : (note.viewedAt as Date),
                        )}
                        )
                      </Text>
                      {note.status === "NEW" ? (
                        <Lozenge appearance="new">🕒 NEW</Lozenge>
                      ) : (
                        <Lozenge appearance="success">✅ VIEWED</Lozenge>
                      )}
                    </Inline>
                    {note.status === "NEW" ? (
                      <ButtonGroup>
                        <Button
                          appearance="subtle"
                          iconBefore={<TrashIcon label="Delete" />}
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    ) : null}
                  </Inline>
                </Box>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
}

export default Issue;
