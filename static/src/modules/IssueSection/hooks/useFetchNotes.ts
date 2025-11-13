// libs
import { useQuery } from "@tanstack/react-query";

// api
import { getSecureNotes } from "@src/api/notes";

// models
import { ServerResponse } from "@src/shared/models/remoteClient";
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";

// constants
import { NOTES_QUERY_KEYS } from "@src/shared/constants/queryKeys";
import { DEFAULT_STALE_TIME } from "@src/shared/utils/queryClient";

export const useFetchNotes = () => {
  return useQuery<ServerResponse<ViewMySecurityNotes[]>>({
    queryKey: NOTES_QUERY_KEYS.LIST,
    queryFn: getSecureNotes,
    staleTime: DEFAULT_STALE_TIME,
  });
};
