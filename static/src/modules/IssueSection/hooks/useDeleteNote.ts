// libs
import { useMutation } from "@tanstack/react-query";

// api
import { deleteSecureNote } from "@src/api/notes";

// helpers
import { queryClient } from "@src/shared/utils/queryClient";
import { showErrorFlag, showSuccessFlag } from "@src/shared/utils/flag";

// models
import { ServerError } from "@src/shared/models/remoteClient";
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";

// constants
import { NOTES_QUERY_KEYS } from "@src/shared/constants/queryKeys";

export const useDeleteNote = () => {
  return useMutation<ViewMySecurityNotes[], ServerError, string>({
    mutationFn: deleteSecureNote,
    onSuccess: (data) => {
      console.log("!!!deleteSecureNote onSuccess", data);
      queryClient.setQueryData(NOTES_QUERY_KEYS.LIST, data);
      showSuccessFlag({
        title: "Security note successfully deleted",
        description: "Security note successfully deleted, audit logs are still available",
      });
    },
    onError: (error: any) => {
      console.log("!!!deleteSecureNote onError", error);
      console.error("Error delete note:", error);
      showErrorFlag({
        title: "Failed to delete security note",
        description: `Deleting security note is failed with error: ${error.message}`,
      });
    },
  });
};
