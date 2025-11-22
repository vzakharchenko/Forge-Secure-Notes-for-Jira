// libs
import { useMutation } from "@tanstack/react-query";

// api
import { createSecureNote } from "@src/api/notes";

// helpers
import { queryClient } from "@src/shared/utils/queryClient";
import { showSuccessFlag } from "@src/shared/utils/flags";
import { handleDefaultServerError } from "@src/shared/utils/errors";

// models
import { ServerError } from "@src/shared/models/remoteClient";
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";

// constants
import { NOTES_QUERY_KEYS } from "@src/shared/constants/queryKeys";
import { NewSecurityNote } from "@shared/dto/NewSecurityNote";

export const useCreateNote = () => {
  return useMutation<ViewMySecurityNotes[], ServerError, NewSecurityNote>({
    mutationFn: createSecureNote,
    onSuccess: (data) => {
      queryClient.setQueryData(NOTES_QUERY_KEYS.LIST, data);
      showSuccessFlag({
        title: "Security note successfully created",
        description:
          "Security note successfully created, remember send key over slack, telegram, etc.",
      });
    },
    onError: (error) => handleDefaultServerError(error, "Failed to create security note"),
  });
};
