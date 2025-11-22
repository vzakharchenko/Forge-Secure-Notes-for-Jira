// helpers
import api from "@src/api/api";

// models
import { ResolverNames } from "@shared/ResolverNames";
import { PromisedServerResponse } from "@src/shared/models/remoteClient";
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";
import { NewSecurityNote } from "@shared/dto/NewSecurityNote";

export const getSecureNotes = (): PromisedServerResponse<ViewMySecurityNotes[]> =>
  api.get(ResolverNames.GET_MY_SECURED_NOTES);

export const createSecureNote = (
  noteData: NewSecurityNote,
): PromisedServerResponse<ViewMySecurityNotes[]> =>
  api.post(ResolverNames.CREATE_SECURITY_NOTE, noteData);

export const deleteSecureNote = (noteId: string): PromisedServerResponse<ViewMySecurityNotes[]> =>
  api.post(ResolverNames.DELETE_SECURITY_NOTE, { id: noteId });
