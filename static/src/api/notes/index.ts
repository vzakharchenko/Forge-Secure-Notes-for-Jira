// helpers
import api from "@src/api/api";

// models
import { ResolverNames } from "@shared/ResolverNames";
import { PromisedServerResponse } from "@src/shared/models/remoteClient";
import { NewSecurityNote } from "@shared/dto/NewSecurityNote";
import { SecurityNoteIdAndSecurityHashKey } from "@shared/dto";
import { AuditUser, OpenSecurityNote, SecurityNoteData } from "@shared/responses";

export const getSecureNotes = (): PromisedServerResponse<AuditUser> =>
  api.get(ResolverNames.GET_MY_SECURED_NOTES);

export const createSecureNote = (noteData: NewSecurityNote): PromisedServerResponse<AuditUser> =>
  api.post(ResolverNames.CREATE_SECURITY_NOTE, noteData);

export const deleteSecureNote = (noteId: string): PromisedServerResponse<AuditUser> =>
  api.post(ResolverNames.DELETE_SECURITY_NOTE, { id: noteId });

export const getSecureNote = (
  data: SecurityNoteIdAndSecurityHashKey,
): PromisedServerResponse<SecurityNoteData> => api.post(ResolverNames.FETCH_SECURITY_NOTE, data);

export const openSecureNoteLink = (id: string) => (): PromisedServerResponse<OpenSecurityNote> =>
  api.post(ResolverNames.OPEN_LINK_SECURITY_NOTE, { id });
