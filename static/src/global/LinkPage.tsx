import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Box, Inline, Stack, Text } from "@atlaskit/primitives";
import Button from "@atlaskit/button";
import Countdown from "react-countdown";
import EmptyState from "@atlaskit/empty-state";
import TextField from "@atlaskit/textfield";
import { token } from "@atlaskit/tokens";
import { invoke, showFlag } from "@forge/bridge";
import {
  calculateHash,
  decryptMessage,
  DERIVE_PURPOSE_ENCRYPTION,
  DERIVE_PURPOSE_VERIFICATION,
} from "../utils/encodeUtils";
import NotFoundClosedImage from "../img/404.png";
import { Renderer } from "../utils/CountDownUtils";
import { SecurityNoteData } from "../../../shared/responses/SecurityNoteData";
import { ResolverNames } from "../../../shared/ResolverNames";

const GLOBAL_ROUTES = {
  all: { route: "/" },
};

export default function LinkPage(props: Readonly<{ accountId: string }>) {
  const params = useParams();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [encryptionKey, setEncryptionKey] = useState("");
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const validateNote = async () => {
      try {
        const response = await invoke<{ valid: boolean }>(ResolverNames.OPEN_LINK_SECURITY_NOTE, {
          id: params.recordId,
        });
        setIsValid(response.valid);
      } catch (error) {
        console.error("Error validating note:", error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateNote().catch(console.error);
  }, [params.recordId]);

  const handleKeySubmit = async () => {
    if (!encryptionKey.trim()) {
      setError("Please enter the encryption key");
      return;
    }

    setIsLoading(true);
    setError(null);
    const baseKey = await calculateHash(encryptionKey, props.accountId, 200_000);
    const keyForEncryption = await calculateHash(baseKey, DERIVE_PURPOSE_ENCRYPTION, 1000);
    const keyForServer = await calculateHash(baseKey, DERIVE_PURPOSE_VERIFICATION, 1000);
    try {
      const response = await invoke<SecurityNoteData>(ResolverNames.FETCH_SECURITY_NOTE, {
        id: params.recordId,
        keyHash: keyForServer,
      });

      if (response.isError) {
        if (response.errorType === "NO_PERMISSION") {
          setIsValid(false);
          return;
        } else {
          setError(response.message ?? "Error during fetching Security Note");
        }
      }
      const decrypted = await decryptMessage(
        { encrypted: response.encryptedData, iv: response.iv, salt: response.salt },
        keyForEncryption,
      );
      setTimeout(() => {
        setIsClosed(true);
      }, 300_500);
      setDecryptedContent(decrypted);
    } catch (error) {
      console.error("Error fetching note:", error);
      setError("Failed to decrypt the note. Please check your key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAndClose = async () => {
    if (decryptedContent) {
      await navigator.clipboard.writeText(decryptedContent);
      showFlag({
        id: "copy",
        title: "Security Note successfully copied",
        description: "Security Note successfully copied",
        type: "success",
        appearance: "success",
        isAutoDismiss: true,
      });
      setIsClosed(true);
    }
  };

  const handleClose = () => {
    setIsClosed(true);
  };

  if (isClosed) {
    return (
      <Box padding="space.400">
        <Stack space="space.400">
          <Box
            padding="space.400"
            style={{
              background: token("elevation.surface.sunken", "#DFE1E6"),
              borderRadius: token("border.radius.200", "3px"),
            }}
          >
            <Stack space="space.400">
              <Box>
                <Text size="large" weight="bold">
                  🔐 Secure Note
                </Text>
              </Box>

              <Box>
                <Text>✅ You have successfully viewed this secure note.</Text>
              </Box>

              <Box>
                <Text>
                  This note has now been destroyed and is no longer accessible through this link.
                </Text>
              </Box>

              <Box>
                <Text>
                  If you need to view it again, please contact the sender and ask them to resend the
                  message.
                </Text>
              </Box>

              <Box
                padding="space.200"
                style={{
                  background: token("color.background.warning", "#FFEBE6"),
                  borderRadius: token("border.radius.200", "3px"),
                }}
              >
                <Text>
                  🛑 For security reasons, this app does not store the message contents or the
                  decryption key.
                </Text>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box padding="space.400" style={{ textAlign: "center" }}>
        <Stack space="space.400" alignInline="center">
          <Text>Loading...</Text>
        </Stack>
      </Box>
    );
  }

  if (isValid === false) {
    return (
      <EmptyState
        header="Invalid URL Entered"
        description="The URL you have entered is not valid. Please check it for any typos or mistakes and try again."
        headingLevel={2}
        primaryAction={
          <Button appearance="primary" onClick={() => navigate(GLOBAL_ROUTES.all.route)}>
            Go to Main Page
          </Button>
        }
        imageUrl={NotFoundClosedImage}
      />
    );
  }

  if (decryptedContent) {
    return (
      <Box padding="space.400">
        <Stack space="space.400">
          <Box
            padding="space.400"
            style={{
              background: token("elevation.surface.sunken", "#DFE1E6"),
              borderRadius: token("border.radius.200", "3px"),
            }}
          >
            <Stack space="space.400">
              <Box>
                <Text size="large" weight="bold">
                  🔐 Secure Note
                </Text>
              </Box>

              <Box>
                <Text>This secure note is only available once.</Text>
                <Text>Make sure to copy it before closing.</Text>
              </Box>

              <Box>
                <Text>
                  ⏳ Time remaining: [ <Countdown date={Date.now() + 300_000} renderer={Renderer} />{" "}
                  ]
                </Text>
              </Box>

              <Box
                padding="space.400"
                style={{
                  background: token("elevation.surface", "#FFFFFF"),
                  borderRadius: token("border.radius.200", "3px"),
                  border: `1px solid ${token("color.border", "#DFE1E6")}`,
                  whiteSpace: "pre-wrap",
                }}
              >
                <Text>{decryptedContent}</Text>
              </Box>

              <Inline space="space.100" spread="space-between">
                <Button appearance="primary" onClick={handleCopyAndClose}>
                  📋 Copy and Close
                </Button>
                <Button appearance="subtle" onClick={handleClose}>
                  ❌ Close
                </Button>
              </Inline>
            </Stack>
          </Box>
        </Stack>
      </Box>
    );
  }

  return (
    <Box padding="space.400">
      <Stack space="space.400">
        <Box
          padding="space.400"
          style={{
            background: token("elevation.surface.sunken", "#DFE1E6"),
            borderRadius: token("border.radius.200", "3px"),
          }}
        >
          <Stack space="space.400">
            <Box>
              <Text size="large" weight="bold">
                🔐 Secure Note Decryption
              </Text>
            </Box>

            <Box>
              <Text>This secure note is protected with an encryption key.</Text>
            </Box>

            <Box>
              <Text>
                Please enter the decryption key you received from the sender. Without the correct
                key, the message cannot be unlocked.
              </Text>
            </Box>

            <Box>
              <Text>Decryption Key:</Text>
              <Box style={{ marginTop: token("space.100", "8px") }}>
                <TextField
                  value={encryptionKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEncryptionKey(e.target.value)
                  }
                  placeholder="Enter decryption key"
                  isInvalid={!!error}
                  style={{ width: "100%" }}
                />
              </Box>
            </Box>

            {error && (
              <Box
                padding="space.200"
                style={{
                  background: token("color.background.danger", "#FFEBE6"),
                  borderRadius: token("border.radius.200", "3px"),
                }}
              >
                <Text>❌ {error}</Text>
              </Box>
            )}

            <Box style={{ textAlign: "center" }}>
              <Button
                appearance="primary"
                onClick={handleKeySubmit}
                isDisabled={!encryptionKey.trim()}
              >
                🔓 Decrypt Note
              </Button>
            </Box>

            <Box
              padding="space.200"
              style={{
                background: token("color.background.warning", "#FFEBE6"),
                borderRadius: token("border.radius.200", "3px"),
              }}
            >
              <Text>
                ⚠️ Tip: The key should have been shared with you securely via Slack, email, or other
                channel. This app does not have access to it.
              </Text>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
