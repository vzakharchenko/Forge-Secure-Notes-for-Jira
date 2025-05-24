import React, {useState} from "react";
import {Box, Inline, Stack, Text} from "@atlaskit/primitives";
import Button, {ButtonGroup} from "@atlaskit/button";
import AddIcon from "@atlaskit/icon/glyph/add";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import OpenIcon from "@atlaskit/icon/glyph/open";
import Lozenge from "@atlaskit/lozenge";
import {token} from "@atlaskit/tokens";
import {ViewMySecurityNotes} from "./models/ViewMySecurityNotes";
import {formatDateTime} from "./utils/dateUtils";
import {showNewIssueModal} from "./utils/ModalUtils";
import {NoteDataType} from "./Types";

// Пример данных в формате ViewMySecurityNotes
const initialNotes: ViewMySecurityNotes[] = [
  {
    id: "1",
    createdBy: {
      accountId: "user1",
      displayName: "Alice",
      avatarUrl: "https://example.com/avatar1.png"
    },
    targetUser: {
      accountId: "currentUser",
      displayName: "Current User",
      avatarUrl: "https://example.com/avatar2.png"
    },
    viewTimeOut: "3mins",
    status: "NEW",
    expiration: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    issueId: "123",
    issueKey: "PROJ-123",
    createdAt: new Date(),
    isError: false
  },
  {
    id: "2",
    createdBy: {
      accountId: "user2",
      displayName: "Bob",
      avatarUrl: "https://example.com/avatar3.png"
    },
    targetUser: {
      accountId: "currentUser",
      displayName: "Current User",
      avatarUrl: "https://example.com/avatar2.png"
    },
    viewTimeOut: "5mins",
    status: "VIEWED",
    expiration: new Date(Date.now() - 24 * 60 * 60 * 1000), // expired
    issueId: "124",
    issueKey: "PROJ-124",
    createdAt: new Date(),
    viewedAt: new Date(),
    isError: false
  },
  {
    id: "3",
    createdBy: {
      accountId: "currentUser",
      displayName: "Current User",
      avatarUrl: "https://example.com/avatar2.png"
    },
    targetUser: {
      accountId: "user3",
      displayName: "Carol",
      avatarUrl: "https://example.com/avatar4.png"
    },
    viewTimeOut: "15mins",
    status: "NEW",
    expiration: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    issueId: "125",
    issueKey: "PROJ-125",
    createdAt: new Date(),
    isError: false
  },
  {
    id: "4",
    createdBy: {
      accountId: "currentUser",
      displayName: "Current User",
      avatarUrl: "https://example.com/avatar2.png"
    },
    targetUser: {
      accountId: "user4",
      displayName: "Dave",
      avatarUrl: "https://example.com/avatar5.png"
    },
    viewTimeOut: "30mins",
    status: "VIEWED",
    expiration: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    issueId: "126",
    issueKey: "PROJ-126",
    createdAt: new Date(),
    viewedAt: new Date(),
    isError: false
  }
];

function App(props: Readonly<{accountId: string}>) {
  const [notes, setNotes] = useState(initialNotes);
  const currentUserId = props.accountId

  const incomingNotes = notes.filter(note => note.targetUser.accountId === currentUserId);
  const sentNotes = notes.filter(note => note.targetUser.accountId !== currentUserId);

  const handleNewNote = async () => {
    await showNewIssueModal(async (noteDate?:NoteDataType)=>{
      if (!noteDate) {
        return
      }
      console.error(JSON.stringify(noteDate))
    })
  };

  const handleOpenNote = (noteId: string) => {
    alert(`Открыть заметку: ${noteId}`);
  };

  const handleDeleteNote = (noteId: string) => {
    alert(`Удалить заметку: ${noteId}`);
  };

  return (
    <Box padding="space.400" style={{ maxWidth: 600, margin: "32px auto" }}>
      <Stack space="space.400">
        <Inline alignBlock="center" spread="space-between">
          <h2 style={{ margin: 0 }}>🔐 Secure Notes Panel</h2>
          <Button
            appearance="primary"
            iconBefore={<AddIcon label="Add"/>}
            onClick={handleNewNote}
          >
            New Secure Note
          </Button>
        </Inline>
        { incomingNotes.length?
        <Box>
          <h3 style={{ margin: 0 }}>📬 Incoming Notes (to me)</h3>
          <Stack space="space.200">
            {incomingNotes.map((note) => (
              <Box
                key={note.id}
                padding="space.200"
                style={{ background: token('elevation.surface.sunken', '#DFE1E6'), borderRadius: 8 }}
              >
                <Inline spread="space-between" alignBlock="center">
                  <Inline space="space.200" alignBlock="center">
                    {note.status === "NEW" ? (
                      <Lozenge appearance="new">🕒 NEW</Lozenge>
                    ) : (
                      <Lozenge appearance="success">✅ VIEWED</Lozenge>
                    )}
                    <Text>From: {note.createdBy.displayName}</Text>
                    <Text>({formatDateTime(note.expiration)})</Text>
                  </Inline>
                  <ButtonGroup>
                    <Button
                      appearance="subtle"
                      iconBefore={<OpenIcon label="Open" />}
                      onClick={() => handleOpenNote(note.id)}
                    >
                      Open
                    </Button>
                  </ButtonGroup>
                </Inline>
              </Box>
            ))}
          </Stack>
        </Box>: null
        }
        { sentNotes.length?
        <Box>
          <h3 style={{ margin: 0 }}>📤 Sent Notes (from me)</h3>
          <Stack space="space.200">
            {sentNotes.map((note) => (
              <Box
                key={note.id}
                padding="space.200"
                style={{ background: token('elevation.surface.sunken', '#DFE1E6'), borderRadius: 8 }}
              >
                <Inline spread="space-between" alignBlock="center">
                  <Inline space="space.200" alignBlock="center">
                    <Text>To: {note.targetUser.displayName}</Text>
                    <Text>({formatDateTime(note.expiration)})</Text>
                    {note.status === "NEW" && (
                      <Lozenge appearance="new">NEW</Lozenge>
                    )}
                  </Inline>
                  <ButtonGroup>
                    <Button
                      appearance="subtle"
                      iconBefore={<TrashIcon label="Delete" />}
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </Inline>
              </Box>
            ))}
          </Stack>
        </Box>:null
        }
      </Stack>
    </Box>
  );
}

export default App;
