// libs
import React, { useEffect, useState } from "react";
import { view } from "@forge/bridge";
import { Request } from "./constants";
import { v4 as uuid } from "uuid";

// helpers
import { schema } from "./schema";
import {
  calculateHash,
  DERIVE_PURPOSE_ENCRYPTION,
  DERIVE_PURPOSE_VERIFICATION,
  encryptMessage,
} from "@src/shared/utils/encode";
import { getValidationErrors } from "@shared/CommonValidator";

// models
import { NewSecurityNote } from "@shared/dto/NewSecurityNote";
import { SecureNoteFormFields } from "./models";

// components
import FormContainer from "@src/components/forms/FormContainer/FormContainer";
import SecureNoteForm from "./SecureNoteForm";
import { CustomerRequest } from "../../../shared/models/customerRequest";
import { SALT_ITERATIONS } from "@shared/Types";
import { getRequestByKey, getUserById } from "../../../api/jira/user";
import PageLoading from "@src/components/loaders/PageLoading/PageLoading";

const BASE_ITERATION = 200_000;
const ENCRYPTION_ITERATIONS = 1000;
const VERIFICATION_ITERATIONS = 1000;

const SecureNoteFormContainer = ({
  accountId,
  targetAccountId,
  customerRequest,
}: {
  accountId: string;
  targetAccountId?: string;
  customerRequest?: CustomerRequest;
}) => {
  const [isCopyKey, setIsCopyKey] = useState(false);

  const handleSubmit = async (data: SecureNoteFormFields) => {
    const { targetUsers, description, note, expiryOption, expiryDate, encryptionKey } = data;
    const expiry = expiryOption === "custom" ? expiryDate : expiryOption;
    const descriptionText = description.trim();
    const salt = await calculateHash(descriptionText ?? accountId, accountId, SALT_ITERATIONS);
    const baseKey = await calculateHash(encryptionKey, salt, BASE_ITERATION);
    const keyForEncryption = await calculateHash(
      baseKey,
      DERIVE_PURPOSE_ENCRYPTION,
      ENCRYPTION_ITERATIONS,
    );
    const keyForServer = await calculateHash(
      baseKey,
      DERIVE_PURPOSE_VERIFICATION,
      VERIFICATION_ITERATIONS,
    );
    const encryptedPayload = await encryptMessage(note.trim(), keyForEncryption);
    const noteData: NewSecurityNote = {
      targetUsers: targetUsers.map((user) => ({
        accountId: user.accountId,
        userName: user.displayName,
      })),
      expiry,
      isCustomExpiry: expiryOption === "custom",
      encryptionKeyHash: keyForServer,
      encryptedPayload: encryptedPayload.encrypted,
      iv: encryptedPayload.iv,
      salt: encryptedPayload.salt,
      description: descriptionText,
    };
    const validationErrors = await getValidationErrors(
      { payload: noteData } as Request,
      NewSecurityNote,
    );

    if (Object.keys(validationErrors).length > 0) {
      throw { data: { validationErrors } };
    }
    if (!isCopyKey) {
      try {
        const senderKeyId = uuid();
        if (sessionStorage) {
          const encryptedKeyForLocalBrowserStorage = await encryptMessage(
            encryptionKey,
            await calculateHash(noteData.description, accountId, SALT_ITERATIONS),
          );
          sessionStorage.setItem(senderKeyId, JSON.stringify(encryptedKeyForLocalBrowserStorage));
          noteData.senderKeyId = senderKeyId;
        }
      } catch (e) {
        console.warn(
          "Secure note created, but the decryption key could not be saved to this session. " +
            "The user will need to use the copied key to open the note. Reason:",
          e,
        );
      }
    }
    await view.close(noteData);
  };

  return (
    <FormContainer<SecureNoteFormFields>
      schema={schema}
      onSubmit={handleSubmit}
      onCancel={async () => {
        await view.close();
      }}
      title="Create secure note"
      submitText="Create"
      cancelText="Cancel"
      shouldDisableSubmitOnDirty={false}
      footerAlign="end"
    >
      <SecureNoteForm
        accountId={accountId}
        targetAccountId={targetAccountId}
        customerRequest={customerRequest}
        onCopy={() => setIsCopyKey(true)}
      />
    </FormContainer>
  );
};

export default SecureNoteFormContainer;
