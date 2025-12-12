// libs
import { useQuery } from "@tanstack/react-query";

// api
import { getSecureNotes } from "@src/api/notes";

// constants
import { NOTES_QUERY_KEYS } from "@src/shared/constants/queryKeys";
import { DEFAULT_STALE_TIME } from "@src/shared/utils/queryClient";

export const useFetchNotes = () => {
  return useQuery({
    queryKey: NOTES_QUERY_KEYS.LIST,
    queryFn: getSecureNotes,
    staleTime: DEFAULT_STALE_TIME,
    select: (data) => data.result,
  });
};
