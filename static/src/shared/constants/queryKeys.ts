// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

// NOTES
export const NOTES_QUERY_KEYS = {
  LIST: ["notes", "list"],
};

// NOTE
export const NOTE_QUERY_KEYS = {
  LINK: (id?: string) => ["note", "link", id],
};
