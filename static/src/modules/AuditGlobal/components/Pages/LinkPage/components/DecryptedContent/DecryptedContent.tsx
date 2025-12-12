// libs
import React from "react";

// models
import { DecryptedContentProps } from "./models";

// helpers
import { showSuccessFlag } from "@src/shared/utils/flags";

// components
import { Box, Stack, Text, xcss } from "@atlaskit/primitives";
import Countdown from "react-countdown";
import { Renderer } from "@src/utils/CountDownUtils";
import Button from "@atlaskit/button/new";
import Heading from "@atlaskit/heading";
import ButtonGroup from "@atlaskit/button/button-group";
import TextArea from "@src/components/forms/TextArea/TextArea";

const containerStyles = xcss({
  maxWidth: "624px",
});

const DecryptedContent = ({ decryptedContent, setIsClosed }: DecryptedContentProps) => {
  const handleCopyAndClose = async () => {
    if (decryptedContent) {
      await navigator.clipboard.writeText(decryptedContent);
      showSuccessFlag({ title: "Security note was successfully copied" });
      handleClose();
    }
  };

  const handleClose = () => {
    setIsClosed(true);
  };

  const handleCountdownComplete = () => {
    setTimeout(() => {
      setIsClosed(true);
    }, 2000);
  };

  return (
    <Box padding="space.400">
      <Stack space="space.300">
        <Heading size="large" as="h2">
          Secure note
        </Heading>

        <Stack space="space.100">
          <Text>This secure note is only available once. Make sure to copy it before closing.</Text>
          <Text>
            Time remaining: [{" "}
            <Countdown
              date={Date.now() + 300_000}
              renderer={Renderer}
              onComplete={handleCountdownComplete}
            />{" "}
            ]
          </Text>
        </Stack>

        <Box xcss={containerStyles}>
          <TextArea name="decryptedContent" value={decryptedContent} isReadOnly resize="smart" />
        </Box>

        <Box>
          <ButtonGroup>
            <Button appearance="primary" onClick={handleCopyAndClose}>
              Copy and close
            </Button>
            <Button appearance="default" onClick={handleClose}>
              Close
            </Button>
          </ButtonGroup>
        </Box>
      </Stack>
    </Box>
  );
};

export default DecryptedContent;
