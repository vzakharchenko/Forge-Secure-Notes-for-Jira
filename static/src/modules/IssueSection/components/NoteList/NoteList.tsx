// libs
import React from "react";

// models
import { NoteListProps } from "./models";

// components
import { Stack, Text } from "@atlaskit/primitives";
import NoteCard from "../NoteCard/NoteCard";

const NoteList = ({ title, notes, variant, onOpen, onDelete }: NoteListProps) => {
  if (notes.length === 0) {
    return null;
  }

  return (
    <Stack space="space.100">
      <Text as="p" size="large" weight="bold">
        {title}
      </Text>
      <Stack space="space.200">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            variant={variant}
            onOpen={onOpen}
            onDelete={onDelete}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default NoteList;
