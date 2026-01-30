// libs
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// api
import { openSecureNoteLink } from "@src/api/notes";

// constants
import { NOTE_QUERY_KEYS } from "@src/shared/constants/queryKeys";

// components
import { Box } from "@atlaskit/primitives";
import Button from "@atlaskit/button/new";
import EmptyState from "@atlaskit/empty-state";
import Decryption from "./components/Decryption/Decryption";
import DecryptedContent from "./components/DecryptedContent/DecryptedContent";
import PageLoading from "@src/components/loaders/PageLoading/PageLoading";
import ViewedContent from "./components/ViewedContent/ViewedContent";
import NotFoundClosedImage from "@src/img/404.png";

const SecretPage = ({
  recordId,
  navigate,
  closeNavigate,
}: {
  recordId?: string;
  navigate: () => void;
  closeNavigate?: () => void;
}) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isClosed, setIsClosed] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState<string | null>("");

  const {
    data: secureNoteData,
    isFetching,
    error,
  } = useQuery({
    queryKey: NOTE_QUERY_KEYS.LINK(recordId),
    queryFn: openSecureNoteLink(recordId!),
    enabled: Boolean(recordId),
  });
  const { sourceAccountId = "" } = secureNoteData ?? {};

  useEffect(() => {
    if (!isFetching && secureNoteData) {
      setIsValid(secureNoteData.valid);
    }
  }, [secureNoteData, isFetching]);

  useEffect(() => {
    if (!isFetching && error) {
      setIsValid(false);
    }
  }, [error, isFetching]);

  if (isFetching) {
    return (
      <Box paddingBlockStart="space.1000">
        <PageLoading />
      </Box>
    );
  }

  if (!recordId || !isValid) {
    return (
      <EmptyState
        header="Invalid URL Entered"
        description="The URL you have entered is not valid. Please check it for any typos or mistakes and try again."
        headingLevel={2}
        primaryAction={
          <Button appearance="primary" onClick={() => navigate()}>
            Go to main page
          </Button>
        }
        imageUrl={NotFoundClosedImage}
      />
    );
  }
  if (isClosed) {
    return <ViewedContent actionView={navigate} />;
  }

  if (decryptedContent) {
    return (
      <DecryptedContent
        decryptedContent={decryptedContent}
        setIsClosed={closeNavigate ?? setIsClosed}
      />
    );
  }

  return (
    <Decryption
      sourceAccountId={sourceAccountId}
      recordId={recordId}
      setIsValid={setIsValid}
      setIsClosed={setIsClosed}
      setDecryptedContent={setDecryptedContent}
    />
  );
};

export default SecretPage;
