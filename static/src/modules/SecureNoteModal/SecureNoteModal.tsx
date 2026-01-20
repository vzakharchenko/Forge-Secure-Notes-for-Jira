// libs
import React from "react";

// components
import { Box } from "@atlaskit/primitives";
import SecureNoteFormContainer from "./SecureNoteFormContainer/SecureNoteFormContainer";
import { CustomerRequest } from "../../shared/models/customerRequest";

const SecureNoteModal = ({
  accountId,
  customerRequest,
}: {
  accountId: string;
  customerRequest?: CustomerRequest;
}) => {
  return (
    <Box padding="space.500">
      <SecureNoteFormContainer accountId={accountId} customerRequest={customerRequest} />
    </Box>
  );
};

export default SecureNoteModal;
