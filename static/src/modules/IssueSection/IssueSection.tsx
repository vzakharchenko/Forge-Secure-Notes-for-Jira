// libs
import React, { useEffect, useMemo } from "react";
import { realtime, router } from "@forge/bridge";

// helpers
import { useFetchNotes } from "@src/modules/IssueSection/hooks/useFetchNotes";
import { useCreateNote } from "@src/modules/IssueSection/hooks/useCreateNote";
import { useDeleteNote } from "@src/modules/IssueSection/hooks/useDeleteNote";
import { queryClient } from "@src/shared/utils/queryClient";
import { showNewIssueModal } from "@src/utils/ModalUtils";

// models
import { NewSecurityNote } from "@shared/dto/NewSecurityNote";
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";

// constants
import { SHARED_EVENT_NAME } from "@shared/Types";
import { NOTES_QUERY_KEYS } from "@src/shared/constants/queryKeys";

// components
import { Box, Inline, Stack } from "@atlaskit/primitives";
import Button from "@atlaskit/button/new";
import AddIcon from "@atlaskit/icon/core/add";
import NoteList from "./components/NoteList/NoteList";
import PageLoading from "@src/components/loaders/PageLoading/PageLoading";
import EmptyState from "@atlaskit/empty-state";
import Heading from "@atlaskit/heading";

function IssueSection({
  accountId,
  appUrl,
  issueId,
  timezone,
}: Readonly<{ accountId: string; appUrl: string; issueId: string; timezone: string }>) {
  const { data: notes = [], isFetching: areNotesFetching } = useFetchNotes();
  const { mutate: mutateCreateNote, isPending: isCreateNotePending } = useCreateNote();
  const { mutate: mutateDeleteNote } = useDeleteNote();

  useEffect(() => {
    const globalSubscription = realtime.subscribeGlobal(SHARED_EVENT_NAME, async (payload) => {
      if (payload === issueId) {
        await queryClient.refetchQueries({ queryKey: NOTES_QUERY_KEYS.LIST });
      }
    });

    return () => {
      globalSubscription.then((s) => s.unsubscribe());
    };
  }, []);

  const { incomingNotes, sentNotes } = useMemo(
    () =>
      notes.reduce<{ incomingNotes: ViewMySecurityNotes[]; sentNotes: ViewMySecurityNotes[] }>(
        (acc, note) => {
          if (note.targetUser.accountId === accountId) {
            acc.incomingNotes.push(note);
          }
          if (note.createdBy.accountId === accountId) {
            acc.sentNotes.push(note);
          }
          return acc;
        },
        { incomingNotes: [], sentNotes: [] },
      ),
    [notes, accountId],
  );

  const handleNewNote = async () => {
    await showNewIssueModal(async (noteData?: NewSecurityNote) => {
      console.log("noteData", noteData);
      if (noteData) {
        mutateCreateNote(noteData);
      }
    });
  };

  const handleOpenNote = async (noteId: string) => {
    await router.open(`/jira/apps/${appUrl}${noteId}`);
  };

  const handleDeleteNote = (noteId: string) => {
    mutateDeleteNote(noteId);
  };

  return (
    <Box padding="space.400">
      <Stack space="space.400">
        <Inline alignBlock="center" spread="space-between">
          <Heading size="large" as="h2">
            Secure notes panel
          </Heading>
          <Button
            appearance="primary"
            iconBefore={AddIcon}
            onClick={handleNewNote}
            isDisabled={isCreateNotePending}
          >
            Create secure note
          </Button>
        </Inline>
        {areNotesFetching && <PageLoading text="Loading secure notes" />}
        {!areNotesFetching && !incomingNotes.length && !sentNotes.length && (
          <EmptyState header="There are no secure notes" />
        )}
        {!areNotesFetching && (
          <>
            <NoteList
              title="Incoming notes (to me)"
              notes={incomingNotes}
              variant="incoming"
              onOpen={handleOpenNote}
              timezone={timezone}
            />
            <NoteList
              title="Sent notes (from me)"
              notes={sentNotes}
              variant="sent"
              onDelete={handleDeleteNote}
              timezone={timezone}
            />
          </>
        )}
      </Stack>
    </Box>
  );
}

export default IssueSection;
