// libs
import React from "react";
import { useNavigate } from "react-router";

// constants
import { GLOBAL_ROUTES } from "@src/modules/AuditGlobal/constants/Routes";

// components
import { Box, Stack, Text } from "@atlaskit/primitives";
import SectionMessage from "@atlaskit/section-message";
import Heading from "@atlaskit/heading";
import Button from "@atlaskit/button/new";

const ViewedContent = () => {
  const navigate = useNavigate();

  return (
    <Box padding="space.400">
      <Stack space="space.300">
        <Heading size="large" as="h2">
          Secure note
        </Heading>

        <SectionMessage appearance="success">
          <Text>You have successfully viewed this secure note.</Text>
        </SectionMessage>

        <Stack space="space.100">
          <Text>
            This note has now been destroyed and is no longer accessible through this link.
          </Text>
          <Text>
            If you need to view it again, please contact the sender and ask them to resend the
            message.
          </Text>
          <Text>
            For security reasons, this app does not store the message contents or the decryption
            key.
          </Text>
        </Stack>
        <Box>
          <Button appearance="primary" onClick={() => navigate(GLOBAL_ROUTES.all.route)}>
            Go to main page
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default ViewedContent;
