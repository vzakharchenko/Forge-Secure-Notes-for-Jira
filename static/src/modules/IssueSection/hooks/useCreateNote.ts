// libs
import { useMutation } from "@tanstack/react-query";

// api
import { createSecureNote } from "@src/api/notes";

// helpers
import { queryClient } from "@src/shared/utils/queryClient";
import { showErrorFlag, showSuccessFlag } from "@src/shared/utils/flag";

// models
import { ServerError } from "@src/shared/models/remoteClient";
import { NoteDataType } from "@src/Types";
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";

// constants
import { NOTES_QUERY_KEYS } from "@src/shared/constants/queryKeys";

export const useCreateNote = () => {
  return useMutation<ViewMySecurityNotes[], ServerError, NoteDataType>({
    mutationFn: createSecureNote,
    onSuccess: (data) => {
      console.log("!!!createSecureNote onSuccess", data);
      queryClient.setQueryData(NOTES_QUERY_KEYS.LIST, data);
      showSuccessFlag({
        title: "Security note successfully created",
        description:
          "Security note successfully created, remember send key over slack, telegram, etc.",
      });
    },
    onError: (error: any) => {
      console.log("!!!createSecureNote onError", error);
      console.error("Error creating note:", error);
      showErrorFlag({
        title: "Failed to create security note",
        description: `Creating security note is failed with error: ${error.message}`,
      });
    },
  });
};
