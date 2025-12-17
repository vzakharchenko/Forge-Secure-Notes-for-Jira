// libs
import React from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

// api
import { getSecureNote } from "@src/api/notes";

// helpers
import { schema } from "./schema";
import {
  calculateHash,
  decryptMessage,
  DERIVE_PURPOSE_ENCRYPTION,
  DERIVE_PURPOSE_VERIFICATION,
} from "@src/shared/utils/encode";
import { handleDefaultServerError } from "@src/shared/utils/errors";
import { SecurityNoteIdAndSecurityHashKey } from "@shared/dto";

// models
import { DecryptionFormContainerProps, DecryptionFormFields } from "../models";
import { SecurityNoteData } from "@shared/responses";
import { ServerError } from "@src/shared/models/remoteClient";

// components
import FormContainer from "@src/components/forms/FormContainer/FormContainer";
import FormInput from "@src/components/forms/Input/FormInput";
import { Box, xcss } from "@atlaskit/primitives";

const containerStyles = xcss({
  maxWidth: "624px",
});

const DecryptionFormContainer = ({
  sourceAccountId,
  setIsValid,
  setIsClosed,
  setDecryptedContent,
}: DecryptionFormContainerProps) => {
  const params = useParams();

  const { mutateAsync: mutateAsyncGetSecureNote } = useMutation<
    SecurityNoteData,
    ServerError,
    SecurityNoteIdAndSecurityHashKey
  >({
    mutationFn: getSecureNote,
    onError: (error) => {
      if (error.data.errorType === "NO_PERMISSION") {
        setIsValid(false);
      }
      if (error.data.errorType !== "VALIDATION") {
        handleDefaultServerError(error, "Failed to fetch security note");
      }
    },
  });

  const handleSubmit = async ({ decryptionKey }: DecryptionFormFields) => {
    const baseKey = await calculateHash(decryptionKey, sourceAccountId ?? "", 200_000);
    const keyForEncryption = await calculateHash(baseKey, DERIVE_PURPOSE_ENCRYPTION, 1000);
    const keyForServer = await calculateHash(baseKey, DERIVE_PURPOSE_VERIFICATION, 1000);

    const decryptionData = {
      id: params.recordId!,
      keyHash: keyForServer,
    };

    const response = await mutateAsyncGetSecureNote(decryptionData);
    console.log("response", response);
    const decrypted = await decryptMessage(
      { encrypted: response.encryptedData, iv: response.iv, salt: response.salt },
      keyForEncryption,
    );

    setTimeout(() => {
      setIsClosed(true);
    }, 300_500);

    setDecryptedContent(decrypted);
  };

  return (
    <Box xcss={containerStyles}>
      <FormContainer<DecryptionFormFields>
        schema={schema}
        onSubmit={handleSubmit}
        submitText="Decrypt note"
        shouldDisableSubmitOnDirty={false}
      >
        <FormInput name="decryptionKey" label="Decryption key" isRequired />
      </FormContainer>
    </Box>
  );
};

export default DecryptionFormContainer;
