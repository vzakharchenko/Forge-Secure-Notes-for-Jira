import React, {ChangeEvent, useState} from 'react';
import {Box, Inline, Stack, Text,} from '@atlaskit/primitives';
import Button from '@atlaskit/button';
import {showFlag, view} from '@forge/bridge';
import {token} from '@atlaskit/tokens';
import {DatePicker} from '@atlaskit/datetime-picker';
import Form from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';
import {RadioGroup} from '@atlaskit/radio';
import SectionMessage from '@atlaskit/section-message';
import Heading from '@atlaskit/heading';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import {SingleValue} from "@atlaskit/react-select/types";
import JiraUserSelect from "./components/JiraUserSelect";
import {calculateHash, calculateHashBase64, encryptMessage} from "./utils/encodeUtils";
import {NoteDataType} from "./Types";

interface UserOption {
  avatarUrl: string
  id:string
  name:string
}

const EXPIRY_OPTIONS = [
  { label: '1 Hour', value: '1h' },
  { label: '1 Day', value: '1d' },
  { label: '7 Days', value: '7d' },
  { label: 'Custom', value: 'custom' },
];

const generateNewKey = async (accountId:string) => {
  return await calculateHashBase64(Math.random().toString(8).substring(7), accountId,80000);
};

const NewSecureNote = (props:{accountId:string}) => {
  const [selectedUser, setSelectedUser] = useState<SingleValue<UserOption>>(null);
  const [noteText, setNoteText] = useState('');
  const [expiryOption, setExpiryOption] = useState('1h');
  const [customDate, setCustomDate] = useState<string>('');
  const [encryptionKey, setEncryptionKey] = useState<string>('');

  const isFormValid = () => {
    if (!selectedUser) return false;
    if (!noteText.trim()) return false;
    if (!encryptionKey) return false;
    if (expiryOption === 'custom' && !customDate) return false;
    return true;
  };

  const createNewKey = async () => {
    setEncryptionKey(await generateNewKey(props.accountId));
  };

  const copyKeyToClipboard = () => {
    navigator.clipboard.writeText(encryptionKey);
  };

  const handleCreateNote = async () => {
    if (!selectedUser) {
       showFlag({
        id: 'selectedUser',
        title: 'Target user',
        description: 'Please select target user',
        type: 'error',
        appearance:  'error',
        isAutoDismiss: true
      })
      return;
    }

    if (!noteText.trim()) {
       showFlag({
        id: 'note',
        title: 'Note text',
        description: 'Please enter note text',
        type: 'error',
        appearance:  'error',
        isAutoDismiss: true
      })
      return;
    }

    if (!encryptionKey) {
      showFlag({
        id: 'key',
        title: 'encryption key',
        description: 'Please generate encryption key and copy key',
        type: 'error',
        appearance:  'error',
        isAutoDismiss: true
      })
      return;
    }
      const expiry = expiryOption === 'custom' ? customDate : expiryOption;
      const encryptionKeyHash = await calculateHash(encryptionKey, selectedUser.id+expiry, 100000);
      const encryptedPayload = await encryptMessage(noteText.trim(), encryptionKeyHash);
      const noteData: NoteDataType = {
      targetUser: selectedUser.id,
      targetUserName: selectedUser.name,
      expiry,
      isCustomExpiry: expiryOption === 'custom',
          encryptionKeyHash,
      encryptedPayload,
    };
    await view.close(noteData)
  };

  return (
    <Box style={{
      maxHeight: 'calc(100vh)',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh)'
    }}>
      <Box style={{
        margin: '16px auto',
        flex: 1, overflow: 'auto'
      }}>
        <Stack>
          <Box
            style={{
              paddingLeft: token('space.200', '16px'),
              background: token('elevation.surface.sunken', '#DFE1E6'),
              borderRadius: token('border.radius.200', '3px'),
              textAlign: 'center',
            }}
          >
            <Heading size={'large'}>✨ Create New Secure Note</Heading>
          </Box>
          <Box padding={"space.200"}>
            <Stack space="space.200">
              <Form onSubmit={(formState) => {
              }}>
                {({ formProps }) => (
                  <form {...formProps}>
                    <Stack space="space.200">
                      <Box>
                        <Text>To (Recipient):</Text>
                        <JiraUserSelect
                          name="targetUser" onChange={(value: any) => {
                          console.log('JiraUserSelect onChange value:', value);
                          if (value) {
                          const newUser:UserOption = value
                          console.log('Setting selectedUser to:', newUser);
                          setSelectedUser(newUser);
                        } else {
                          console.log('Setting selectedUser to null');
                          setSelectedUser(null);
                        }
                        }}
                          label="Start typing Jira username or display name"
                          selectProps={{
                            menuPosition: "fixed",
                            appearance: "default",
                            placeholder: "Search for a user by name or email",
                            isClearable: true,
                          }}
                          defaultValue={selectedUser ? {
                            accountId: selectedUser.id,
                            displayName: selectedUser.name
                          } : null}
                        />
                      </Box>

                      <Box>
                        <Text>Your Secure Note (max 10KB recommended):</Text>
                        <TextArea
                          value={noteText}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNoteText(e.target.value)}
                          placeholder="Enter your secret message here..."
                          style={{
                            marginTop: token('space.100', '8px'),
                            minHeight: '150px',
                          }}
                        />
                      </Box>

                      <Box>
                        <Text>Set Note Expiry:</Text>
                        <Box style={{ marginTop: token('space.100', '8px') }}>
                          <Inline space="space.100" alignBlock="center">
                            {EXPIRY_OPTIONS.map((option) => (
                              <RadioGroup
                                key={option.value}
                                options={[option]}
                                value={expiryOption}
                                onChange={(e) => setExpiryOption(e.target.value)}
                              />
                            ))}
                            {expiryOption === 'custom' && (
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
                        <Box style={{ marginTop: token('space.100', '8px') }}>
                          <Inline space="space.100" alignBlock="center">
                            <Box
                              style={{
                                padding: token('space.200', '16px'),
                                background: token('elevation.surface.sunken', '#DFE1E6'),
                                borderRadius: token('border.radius.200', '3px'),
                                flex: 1,
                              }}
                            >
                              <Text>{encryptionKey}</Text>
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
                          IMPORTANT: This key is shown only ONCE.
                          Copy it and share securely with the recipient via
                          a separate channel (e.g., secure chat, voice).
                          This app will NOT store or be able to recover
                          this key.
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
          padding: token('space.200', '16px'),
          background: token('elevation.surface.sunken', '#DFE1E6'),
          borderRadius: token('border.radius.200', '3px'),
          marginTop: 'auto'
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
          <Button appearance="subtle" onClick={async ()=>{await view.close()}}>Cancel</Button>
        </Inline>
      </Box>
    </Box>
  );
};

export default NewSecureNote;