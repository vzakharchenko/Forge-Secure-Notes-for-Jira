// libs
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

// api
import { openSecureNoteLink } from "@src/api/notes";

// constants
import { GLOBAL_ROUTES } from "@src/modules/AuditGlobal/constants/Routes";
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

const LinkPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isClosed, setIsClosed] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState<string | null>("");

  const {
    data: secureNoteData,
    isFetching,
    error,
  } = useQuery({
    queryKey: NOTE_QUERY_KEYS.LINK(params.recordId),
    queryFn: openSecureNoteLink(params.recordId!),
    enabled: Boolean(params.recordId),
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

  if (!params.recordId || !isValid) {
    return (
      <EmptyState
        header="Invalid URL Entered"
        description="The URL you have entered is not valid. Please check it for any typos or mistakes and try again."
        headingLevel={2}
        primaryAction={
          <Button appearance="primary" onClick={() => navigate(GLOBAL_ROUTES.all.route)}>
            Go to main page
          </Button>
        }
        imageUrl={NotFoundClosedImage}
      />
    );
  }

  if (isClosed) {
    return <ViewedContent />;
  }

  if (decryptedContent) {
    return <DecryptedContent decryptedContent={decryptedContent} setIsClosed={setIsClosed} />;
  }

  return (
    <Decryption
      sourceAccountId={sourceAccountId}
      setIsValid={setIsValid}
      setIsClosed={setIsClosed}
      setDecryptedContent={setDecryptedContent}
    />
  );
};

export default LinkPage;
