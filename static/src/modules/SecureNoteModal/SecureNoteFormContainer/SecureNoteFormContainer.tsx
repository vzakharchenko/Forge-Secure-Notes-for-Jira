// libs
import React from "react";
import { view } from "@forge/bridge";
import { Request } from "@forge/resolver";

// helpers
import { schema } from "./schema";
import {
  calculateHash,
  DERIVE_PURPOSE_ENCRYPTION,
  DERIVE_PURPOSE_VERIFICATION,
  encryptMessage,
} from "@src/shared/utils/encode";
import { getValidationErrors } from "../../../../../src/core/decorators/ValidBodyHandlerDecorator";

// models
import { NewSecurityNote } from "@shared/dto/NewSecurityNote";
import { SecureNoteFormFields } from "./models";

// components
import FormContainer from "@src/components/forms/FormContainer/FormContainer";
import SecureNoteForm from "./SecureNoteForm";

const SecureNoteFormContainer = ({ accountId }: { accountId: string }) => {
  const handleSubmit = async (data: SecureNoteFormFields) => {
    const { targetUsers, description, note, expiryOption, expiryDate, encryptionKey } = data;
    const expiry = expiryOption === "custom" ? expiryDate : expiryOption;
    const descriptionText = description.trim();
    const salt = await calculateHash(descriptionText ?? accountId, accountId, 1000);
    const baseKey = await calculateHash(encryptionKey, salt, 200_000);
    const keyForEncryption = await calculateHash(baseKey, DERIVE_PURPOSE_ENCRYPTION, 1000);
    const keyForServer = await calculateHash(baseKey, DERIVE_PURPOSE_VERIFICATION, 1000);
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
      <SecureNoteForm accountId={accountId} />
    </FormContainer>
  );
};

export default SecureNoteFormContainer;
