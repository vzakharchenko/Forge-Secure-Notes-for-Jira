// libs
import { useMutation } from "@tanstack/react-query";

// api
import { deleteSecureNote } from "@src/api/notes";

// helpers
import { queryClient } from "@src/shared/utils/queryClient";
import { showSuccessFlag } from "@src/shared/utils/flags";
import { handleDefaultServerError } from "@src/shared/utils/errors";

// models
import { ServerError } from "@src/shared/models/remoteClient";
import { AuditUser } from "@shared/responses";

// constants
import { NOTES_QUERY_KEYS } from "@src/shared/constants/queryKeys";

export const useDeleteNote = () => {
  return useMutation<AuditUser, ServerError, string>({
    mutationFn: deleteSecureNote,
    onSuccess: (data) => {
      queryClient.setQueryData(NOTES_QUERY_KEYS.LIST, data.result);
      showSuccessFlag({
        title: "Security note successfully deleted",
        description: "Security note successfully deleted, audit logs are still available",
      });
    },
    onError: (error) => handleDefaultServerError(error, "Failed to delete security note"),
  });
};
