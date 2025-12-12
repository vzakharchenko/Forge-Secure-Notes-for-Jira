// libs
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

// api
import { formatOptionLabelJiraUser, loadUsers } from "@src/shared/utils/users";

// helpers
import { useFormContext } from "@src/components/forms/FormContainer/FormProvider";
import { dateNow } from "@src/shared/utils/date";
import { addDays } from "date-fns";
import { showSuccessFlag } from "@src/shared/utils/flags";
import { generateNewKey } from "./helpers";

// constants
import { DEFAULT_DEBOUNCE_TIME } from "@src/shared/constants/common";
import { EXPIRY_OPTIONS } from "./constants";

//components
import { Box, Stack, Text, xcss } from "@atlaskit/primitives";
import { IconButton } from "@atlaskit/button/new";
import SectionMessage from "@atlaskit/section-message";
import FormInput from "@src/components/forms/Input/FormInput";
import FormTextArea from "@src/components/forms/TextArea/FormTextArea";
import FormRadioGroup from "@src/components/forms/Radio/FormRadioGroup";
import FormMultiAutocomplete from "@src/components/forms/selects/MultiAutocomplete/FormMultiAutocomplete";
import FormDatePicker from "@src/components/forms/DatePicker/FormDatePicker";
import CopyIcon from "@atlaskit/icon/core/copy";
import RefreshIcon from "@atlaskit/icon/core/refresh";

const stackStyles = xcss({
  marginTop: "space.100",
  marginBottom: "space.500",
});

const SecureNoteForm = ({ accountId }: { accountId: string }) => {
  const { setFieldValue } = useFormContext();
  const [isCustomExpiry, setIsCustomExpiry] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState("");

  const minDate = useMemo(() => addDays(dateNow(), 1), []);

  useEffect(() => {
    createNewKey();
  }, []);

  const createNewKey = () => {
    generateNewKey(accountId).then((key) => {
      setFieldValue("encryptionKey", key);
      setEncryptionKey(key);
    });
  };

  const copyKeyToClipboard = () => {
    if (!encryptionKey) {
      return;
    }
    navigator.clipboard.writeText(encryptionKey);
    showSuccessFlag({
      title: "Key was copied successfully",
      description: "You can sent over slack, telegram, etc.",
    });
  };

  const onExpiryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setIsCustomExpiry(value === "custom");
  };

  return (
    <Stack space="space.200" xcss={stackStyles}>
      <Box>
        <FormMultiAutocomplete
          name="targetUsers"
          label="To (Recipients)"
          helperMessage="Select users by Jira username or display name"
          loadOptions={debounce(loadUsers, DEFAULT_DEBOUNCE_TIME)}
          formatOptionLabel={formatOptionLabelJiraUser}
          defaultOptions
          isScrollable
          isRequired
        />
        <FormInput
          name="description"
          label="Description"
          placeholder="Enter description of what you are sharing..."
          isRequired
        />
        <FormTextArea
          name="note"
          label="Your Secure Note (max 10KB recommended)"
          placeholder="Enter your secret message here..."
          isRequired
        />
        <FormRadioGroup
          name="expiryOption"
          label="Note expiry"
          options={EXPIRY_OPTIONS}
          isRequired
          defaultValue="1h"
          onChange={onExpiryChange}
          isRow
        />
        <FormDatePicker
          name="expiryDate"
          label="Expiry date (UTC)"
          minDate={minDate}
          isRequired={isCustomExpiry}
          isDisabled={!isCustomExpiry}
        />
        <FormInput
          name="encryptionKey"
          label="Decryption key"
          isReadOnly
          isRequired
          elemAfterInput={
            <>
              <IconButton
                icon={CopyIcon}
                label="Copy"
                appearance="subtle"
                onClick={copyKeyToClipboard}
                isTooltipDisabled={false}
              />
              <IconButton
                icon={RefreshIcon}
                label="Generate new key"
                appearance="subtle"
                onClick={createNewKey}
                isTooltipDisabled={false}
              />
            </>
          }
        />
      </Box>
      <SectionMessage appearance="warning">
        <Text>
          IMPORTANT: This key is shown only ONCE. Copy it and share securely with the recipient via
          a separate channel (e.g., secure chat, voice). This app will NOT store or be able to
          recover this key.
        </Text>
      </SectionMessage>
    </Stack>
  );
};

export default SecureNoteForm;
