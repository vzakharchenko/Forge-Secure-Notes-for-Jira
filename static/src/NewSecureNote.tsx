import React, { ChangeEvent, useState } from "react";
import { Box, Inline, Stack, Text } from "@atlaskit/primitives";
import Button from "@atlaskit/button";
import { showFlag, view } from "@forge/bridge";
import { token } from "@atlaskit/tokens";
import { DatePicker } from "@atlaskit/datetime-picker";
import Form from "@atlaskit/form";
import TextArea from "@atlaskit/textarea";
import TextField from "@atlaskit/textfield";
import { RadioGroup } from "@atlaskit/radio";
import SectionMessage from "@atlaskit/section-message";
import Heading from "@atlaskit/heading";
import CopyIcon from "@atlaskit/icon/glyph/copy";
import RefreshIcon from "@atlaskit/icon/glyph/refresh";
import JiraUserSelect from "./components/JiraUserSelect";
import {
  calculateHash,
  calculateHashBase64,
  DERIVE_PURPOSE_ENCRYPTION,
  DERIVE_PURPOSE_VERIFICATION,
  encryptMessage,
} from "./utils/encodeUtils";
import { NoteDataType } from "./Types";

interface UserOption {
  avatarUrl: string;
  id: string;
  name: string;
}

const EXPIRY_OPTIONS = [
  { label: "1 Hour", value: "1h" },
  { label: "1 Day", value: "1d" },
  { label: "7 Days", value: "7d" },
  { label: "10 Days", value: "10d" },
];

const generateNewKey = async (accountId: string) => {
  return await calculateHashBase64(Math.random().toString(8).substring(7), accountId, 80000);
};

const NewSecureNote = (props: { accountId: string }) => {
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);
  const [description, setDescription] = useState("");
  const [noteText, setNoteText] = useState("");
  const [expiryOption, setExpiryOption] = useState("1h");
  const [customDate, setCustomDate] = useState<string>("");
  const [encryptionKey, setEncryptionKey] = useState<string>("");

  const isFormValid = () => {
    if (!selectedUsers || selectedUsers.length === 0) return false;
    if (!description.trim()) return false;
    if (!noteText.trim()) return false;
    if (!encryptionKey) return false;
    if (expiryOption === "custom" && !customDate) return false;
    return true;
  };

  const createNewKey = async () => {
    setEncryptionKey(await generateNewKey(props.accountId));
    showFlag({
      id: "key",
      title: "Key successfully generated, you can copy it and sent over slack, telegram or etc...",
      description:
        "Key successfully generated, you can copy it and sent over slack, telegram or etc...",
      type: "info",
      appearance: "info",
      isAutoDismiss: false,
    });
  };

  const copyKeyToClipboard = () => {
    navigator.clipboard.writeText(encryptionKey);
    showFlag({
      id: "copy",
      title: "Key successfully copied, you can sent key over slack, telegram or etc...",
      description: "Key successfully copied, you can sent key over slack, telegram or etc...",
      type: "success",
      appearance: "success",
      isAutoDismiss: true,
    });
  };

  const handleCreateNote = async () => {
    if (!selectedUsers || selectedUsers.length === 0) {
      showFlag({
        id: "selectedUser",
        title: "Target users",
        description: "Please select at least one target user",
        type: "error",
        appearance: "error",
        isAutoDismiss: true,
      });
      return;
    }

    if (!description.trim()) {
      showFlag({
        id: "description",
        title: "Description",
        description: "Please enter description",
        type: "error",
        appearance: "error",
        isAutoDismiss: true,
      });
      return;
    }

    if (!noteText.trim()) {
      showFlag({
        id: "note",
        title: "Note text",
        description: "Please enter note text",
        type: "error",
        appearance: "error",
        isAutoDismiss: true,
      });
      return;
    }

    if (!encryptionKey) {
      showFlag({
        id: "key",
        title: "encryption key",
        description: "Please generate encryption key and copy key",
        type: "error",
        appearance: "error",
        isAutoDismiss: true,
      });
      return;
    }
    const expiry = expiryOption === "custom" ? customDate : expiryOption;
    const baseKey = await calculateHash(encryptionKey, props.accountId, 200_000);
    const keyForEncryption = await calculateHash(baseKey, DERIVE_PURPOSE_ENCRYPTION, 1000);
    const keyForServer = await calculateHash(baseKey, DERIVE_PURPOSE_VERIFICATION, 1000);
    const encryptedPayload = await encryptMessage(noteText.trim(), keyForEncryption);
    const noteData: NoteDataType = {
      targetUsers: selectedUsers.map((user) => ({
        accountId: user.id,
        userName: user.name,
      })),
      expiry,
      isCustomExpiry: expiryOption === "custom",
      encryptionKeyHash: keyForServer,
      encryptedPayload: encryptedPayload.encrypted,
      iv: encryptedPayload.iv,
      salt: encryptedPayload.salt,
      description: description.trim(),
    };
    await view.close(noteData);
  };

  return (
    <Box
      style={{
        maxHeight: "calc(100vh)",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh)",
      }}
    >
      <Box
        style={{
          margin: "8px auto",
          flex: 1,
          overflow: "auto",
        }}
      >
        <Stack>
          <Box
            style={{
              paddingLeft: token("space.100", "8px"),
              paddingTop: token("space.050", "4px"),
              paddingBottom: token("space.050", "4px"),
              background: token("elevation.surface.sunken", "#DFE1E6"),
              borderRadius: token("border.radius.200", "3px"),
              textAlign: "center",
            }}
          >
            <Heading size={"medium"}>✨ Create New Secure Note</Heading>
          </Box>
          <Box padding={"space.100"}>
            <Stack space="space.100">
              {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
              <Form onSubmit={(formState) => {}}>
                {({ formProps }) => (
                  <form {...formProps}>
                    <Stack space="space.100">
                      <Box>
                        <Text>To (Recipients):</Text>
                        <JiraUserSelect
                          isMulti={true}
                          name="targetUser"
                          onChange={(value: any) => {
                            console.log("JiraUserSelect onChange value:", value);
                            if (value && Array.isArray(value)) {
                              const users: UserOption[] = value;
                              console.log("Setting selectedUsers to:", users);
                              setSelectedUsers(users);
                            } else {
                              console.log("Setting selectedUsers to empty array");
                              setSelectedUsers([]);
                            }
                          }}
                          label="Start typing Jira username or display name"
                          selectProps={{
                            menuPosition: "fixed",
                            appearance: "default",
                            placeholder: "Search for users by name or email",
                            isClearable: true,
                          }}
                          defaultValue={
                            selectedUsers.length > 0
                              ? selectedUsers.map((user) => ({
                                  accountId: user.id,
                                  displayName: user.name,
                                  avatarUrl: user.avatarUrl,
                                }))
                              : null
                          }
                        />
                      </Box>

                      <Box>
                        <Text>Description:</Text>
                        <Box style={{ marginTop: token("space.100", "8px") }}>
                          <TextField
                            value={description}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setDescription(e.target.value)
                            }
                            placeholder="Enter description of what you are sharing..."
                            style={{ width: "100%" }}
                          />
                        </Box>
                      </Box>

                      <Box>
                        <Text>Your Secure Note (max 10KB recommended):</Text>
                        <TextArea
                          value={noteText}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setNoteText(e.target.value)
                          }
                          placeholder="Enter your secret message here..."
                          style={{
                            marginTop: token("space.100", "8px"),
                            minHeight: "100px",
                          }}
                        />
                      </Box>

                      <Box>
                        <Text>Set Note Expiry:</Text>
                        <Box style={{ marginTop: token("space.100", "8px") }}>
                          <Inline space="space.100" alignBlock="center">
                            {EXPIRY_OPTIONS.map((option) => (
                              <RadioGroup
                                key={option.value}
                                options={[option]}
                                value={expiryOption}
                                onChange={(e) => setExpiryOption(e.target.value)}
                              />
                            ))}
                            {expiryOption === "custom" && (
                              <DatePicker
                                value={customDate}
                                onChange={(date: string) => setCustomDate(date)}
                              />
                            )}
                          </Inline>
                        </Box>
                      </Box>

                      <Box>
                        <Text>🔑 Generated Encryption Key:</Text>
                        <Box style={{ marginTop: token("space.100", "8px") }}>
                          <Inline space="space.100" alignBlock="center">
                            <Box
                              style={{
                                padding: token("space.100", "8px"),
                                minHeight: "40px",
                                background: token("elevation.surface.sunken", "#DFE1E6"),
                                borderRadius: token("border.radius.200", "3px"),
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Text>
                                {encryptionKey || (
                                  <span style={{ color: token("color.text.subtle", "#6B778C") }}>
                                    Click "Generate New Key" to create an encryption key
                                  </span>
                                )}
                              </Text>
                            </Box>
                            <Button
                              appearance="default"
                              iconBefore={<RefreshIcon label="Generate" />}
                              onClick={createNewKey}
                            >
                              Generate New Key
                            </Button>
                            <Button
                              appearance="default"
                              iconBefore={<CopyIcon label="Copy" />}
                              onClick={copyKeyToClipboard}
                            >
                              Copy Key to Clipboard
                            </Button>
                          </Inline>
                        </Box>
                      </Box>

                      <SectionMessage appearance="warning">
                        <Text>
                          IMPORTANT: This key is shown only ONCE. Copy it and share securely with
                          the recipient via a separate channel (e.g., secure chat, voice). This app
                          will NOT store or be able to recover this key.
                        </Text>
                      </SectionMessage>
                    </Stack>
                  </form>
                )}
              </Form>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Box
        style={{
          padding: token("space.100", "8px"),
          background: token("elevation.surface.sunken", "#DFE1E6"),
          borderRadius: token("border.radius.200", "3px"),
          marginTop: "auto",
        }}
      >
        <Inline space="space.100" spread="space-between">
          <Button
            appearance="primary"
            iconBefore={<CopyIcon label="Create" />}
            onClick={handleCreateNote}
            isDisabled={!isFormValid()}
          >
            🔒 Create & Encrypt Note
          </Button>
          <Button
            appearance="subtle"
            onClick={async () => {
              await view.close();
            }}
          >
            Cancel
          </Button>
        </Inline>
      </Box>
    </Box>
  );
};

export default NewSecureNote;
