// libs
import React from "react";

// models
import { DecryptionProps } from "./models";

// components
import { Box, Stack, Text } from "@atlaskit/primitives";
import Heading from "@atlaskit/heading";
import SectionMessage from "@atlaskit/section-message";
import DecryptionFormContainer from "./DecryptionFormContainer/DecryptionFormContainer";

const Decryption = ({
  sourceAccountId,
  setIsValid,
  setIsClosed,
  setDecryptedContent,
}: DecryptionProps) => {
  return (
    <Box padding="space.400">
      <Stack space="space.300">
        <Stack space="space.100">
          <Stack space="space.300">
            <Heading size="large" as="h2">
              Secure note decryption
            </Heading>

            <Stack space="space.100">
              <Text>This secure note is protected with an encryption key.</Text>
              <Text>
                Please enter the decryption key you received from the sender. Without the correct
                key, the message cannot be unlocked.
              </Text>
            </Stack>
          </Stack>

          <DecryptionFormContainer
            sourceAccountId={sourceAccountId}
            setIsValid={setIsValid}
            setIsClosed={setIsClosed}
            setDecryptedContent={setDecryptedContent}
          />
        </Stack>

        <SectionMessage>
          <Text>
            The key should have been shared with you securely via Slack, email, or other channel.
            This app does not have access to it.
          </Text>
        </SectionMessage>
      </Stack>
    </Box>
  );
};

export default Decryption;
