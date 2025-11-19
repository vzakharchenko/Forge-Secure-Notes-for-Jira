// libs
import React from "react";

// models
import { NoteListProps } from "./models";

// components
import { Stack } from "@atlaskit/primitives";
import NoteCard from "../NoteCard/NoteCard";
import Heading from "@atlaskit/heading";

const NoteList = ({ title, notes, variant, onOpen, onDelete, timezone }: NoteListProps) => {
  if (notes.length === 0) {
    return null;
  }

  return (
    <Stack space="space.100">
      <Heading size="medium" as="h3">
        {title}
      </Heading>
      <Stack space="space.200">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            variant={variant}
            onOpen={onOpen}
            onDelete={onDelete}
            timezone={timezone}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default NoteList;
