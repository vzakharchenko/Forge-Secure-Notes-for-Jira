// libs
import React from "react";

// components
import { Box } from "@atlaskit/primitives";
import SecureNoteFormContainer from "./SecureNoteFormContainer/SecureNoteFormContainer";

const SecureNoteModal = ({ accountId }: { accountId: string }) => {
  return (
    <Box padding="space.500">
      <SecureNoteFormContainer accountId={accountId} />
    </Box>
  );
};

export default SecureNoteModal;
