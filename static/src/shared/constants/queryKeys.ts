// NOTES
export const NOTES_QUERY_KEYS = {
  LIST: ["notes", "list"],
};

// NOTE
export const NOTE_QUERY_KEYS = {
  LINK: (id?: string) => ["note", "link", id],
};
