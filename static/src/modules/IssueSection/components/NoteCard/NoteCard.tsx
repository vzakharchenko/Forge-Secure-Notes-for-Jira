// libs
import React from "react";

// helpers
import { formatDateWithTimezoneAndFormat } from "@src/shared/utils/date";

// models
import { NoteCardProps } from "./models";

// constants
// components
import { Box, Flex, Text, xcss } from "@atlaskit/primitives";
import { IconButton } from "@atlaskit/button/new";
import Lozenge from "@atlaskit/lozenge";
import DeleteIcon from "@atlaskit/icon/core/delete";
import ArrowUpRightIcon from "@atlaskit/icon/core/arrow-up-right";
import CopyIcon from "@atlaskit/icon/core/copy";

import { calculateHash, decryptMessage } from "@src/shared/utils/encode";
import { SALT_ITERATIONS } from "@shared/Types";
import { showSuccessFlag, showWarningFlag } from "@src/shared/utils/flags";

const getSessionStorageItem = (key: string): string | null => {
  try {
    return sessionStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
};

const getDecodedKey = async (
  senderEncryptedKey: string,
  description: string,
  accountId: string,
): Promise<string | null> => {
  try {
    return await decryptMessage(
      JSON.parse(senderEncryptedKey),
      await calculateHash(description, accountId, SALT_ITERATIONS),
    );
  } catch {
    return null;
  }
};

const KEY_NOT_VALID_FLAG = {
  title: "Key is not valid",
  description: "The decryption key could not be retrieved or is not valid for this note.",
};

const baseContainerStyles = xcss({
  backgroundColor: "elevation.surface.raised",
  padding: "space.150",
  borderRadius: "radius.small",
  boxShadow: "elevation.shadow.raised",
  transition: "200ms",
  display: "flex",
  flexDirection: "column",
  gap: "space.200",
  ":hover": {
    backgroundColor: "elevation.surface.hovered",
  },
});

const clickableContainerStyles = xcss({
  cursor: "pointer",
});

const NoteCard = ({
  note,
  variant,
  onOpen,
  accountId,
  onClick,
  onDelete,
  timezone,
}: NoteCardProps) => {
  const isNew = note.status === "NEW";
  const displayDate = isNew ? note.expiration : note.viewedAt;
  const dateLabel = isNew ? "Expires" : "Viewed";
  const displayUser = variant === "incoming" ? note.createdBy : note.targetUser;
  const userLabel = variant === "incoming" ? "From" : "To";

  const handleCardClick = () => {
    if (onClick) {
      onClick(note.id, accountId);
    }
  };

  const containerStyles = onClick
    ? [baseContainerStyles, clickableContainerStyles]
    : baseContainerStyles;
  return (
    <Box xcss={containerStyles} onClick={onClick ? handleCardClick : undefined}>
      <Flex alignItems="start" justifyContent="space-between">
        <Text as="p" size="large">
          {userLabel}: <Text weight="semibold">{displayUser.displayName}</Text>
        </Text>
        {isNew ? (
          <Lozenge appearance="new">New</Lozenge>
        ) : (
          <Lozenge appearance="success">Viewed</Lozenge>
        )}
      </Flex>
      <Flex alignItems="start" justifyContent="space-between">
        <Box>
          Description: <Text weight="semibold">{note.description}</Text>
        </Box>
      </Flex>
      <Flex alignItems="end" justifyContent="space-between">
        <Box>
          <Text as="p" size="small">
            Created: {formatDateWithTimezoneAndFormat(note.createdAt, timezone)}
          </Text>
          <Text as="p" size="small">
            {dateLabel}: {formatDateWithTimezoneAndFormat(displayDate as Date, timezone)}
          </Text>
        </Box>
        {!isNew && <Box paddingBlock="space.200" />}
        {isNew && (
          <>
            {variant === "incoming" && onOpen && (
              <IconButton
                label="Open"
                icon={ArrowUpRightIcon}
                appearance="subtle"
                isTooltipDisabled={false}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(note.id);
                }}
              />
            )}
            {variant === "sent" && (
              <Flex gap="space.050" alignItems="center">
                {note.senderKeyId && getSessionStorageItem(note.senderKeyId) && (
                  <Box>
                    <IconButton
                      label="Copy Key"
                      icon={CopyIcon}
                      appearance="subtle"
                      isTooltipDisabled={false}
                      onClick={async (e) => {
                        e.stopPropagation();
                        const senderEncryptedKey = getSessionStorageItem(note.senderKeyId ?? "");
                        if (!senderEncryptedKey) {
                          showWarningFlag(KEY_NOT_VALID_FLAG);
                          return;
                        }
                        const decodedKey = await getDecodedKey(
                          senderEncryptedKey,
                          note.description,
                          accountId,
                        );
                        if (!decodedKey) {
                          showWarningFlag(KEY_NOT_VALID_FLAG);
                          return;
                        }
                        navigator.clipboard.writeText(decodedKey);
                        showSuccessFlag({
                          title: "Key was copied successfully",
                          description: "You can sent over slack, telegram, etc.",
                        });
                      }}
                    />
                  </Box>
                )}
                {onDelete && (
                  <IconButton
                    label="Delete"
                    icon={DeleteIcon}
                    appearance="subtle"
                    isTooltipDisabled={false}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(note.id);
                    }}
                  />
                )}
              </Flex>
            )}
          </>
        )}
      </Flex>
    </Box>
  );
};

export default NoteCard;
