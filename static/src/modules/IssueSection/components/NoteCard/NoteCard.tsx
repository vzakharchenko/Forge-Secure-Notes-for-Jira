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

const containerStyles = xcss({
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

const NoteCard = ({ note, variant, onOpen, onDelete, timezone }: NoteCardProps) => {
  const isNew = note.status === "NEW";
  const displayDate = isNew ? note.expiration : note.viewedAt;
  const dateLabel = isNew ? "Expires" : "Viewed";
  const displayUser = variant === "incoming" ? note.createdBy : note.targetUser;
  const userLabel = variant === "incoming" ? "From" : "To";

  return (
    <Flex xcss={containerStyles}>
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
                onClick={() => onOpen(note.id)}
              />
            )}
            {variant === "sent" && onDelete && (
              <IconButton
                label="Delete"
                icon={DeleteIcon}
                appearance="subtle"
                isTooltipDisabled={false}
                onClick={() => onDelete(note.id)}
              />
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default NoteCard;
