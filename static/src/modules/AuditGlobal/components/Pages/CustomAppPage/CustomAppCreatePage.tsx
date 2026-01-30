// libs
import React, { useEffect, useState } from "react";
import { router } from "@forge/bridge";
import { useNavigate, useParams, useSearchParams } from "react-router";

// constants
import { showNewIssueModal } from "@src/utils/ModalUtils";
import { NewCustomAppSecurityNote } from "@shared/dto";
import { Box } from "@atlaskit/primitives";
import PageLoading from "@src/components/loaders/PageLoading/PageLoading";
import { createAppSecureNote } from "@src/api/notes";
import CenterDiv from "@src/components/CenterDiv";

const CustomAppCreatePage = () => {
  const params = useParams();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [searchParams] = useSearchParams();
  const state = searchParams.get("state");
  const accountId = searchParams.get("accountId");
  if (!accountId) {
    return (
      <CenterDiv>
        <Box>Account is empty</Box>
      </CenterDiv>
    );
  }
  const appId = params.appId;
  if (!appId) {
    return (
      <CenterDiv>
        <Box>No app ID found</Box>
      </CenterDiv>
    );
  }
  const envId = params.envId;
  if (!envId) {
    return (
      <CenterDiv>
        <Box>No forge environment found</Box>
      </CenterDiv>
    );
  }
  useEffect(() => {
    const handleNewNote = async () => {
      if (!appId) {
        setErrorMessage("No app ID found");
      } else if (!envId) {
        setErrorMessage("No forge environment found.");
      } else {
        await showNewIssueModal(async (noteData?: NewCustomAppSecurityNote) => {
          let realCallback: string = "";
          realCallback += `/jira/apps/${appId}/${envId}/callback?state=${state ?? "once"}&`;
          if (!appId) {
            realCallback += "event=error&message=No app ID found.";
          } else if (!envId) {
            realCallback += "event=error&message=no forge environment found.";
          } else if (!noteData) {
            realCallback += "event=cancel";
          } else {
            noteData.customAppId = appId;
            noteData.customEnvId = envId;
            try {
              const audit = await createAppSecureNote(noteData);
              if (!audit || !audit.result || audit.isError) {
                realCallback += `event=error&message=${audit?.message ?? "record is not created"}.`;
              } else {
                realCallback += `event=created&notes=${JSON.stringify(
                  audit.result.map((r) => ({
                    id: r.id,
                    expiration: r.expiration,
                  })),
                )}`;
              }
            } catch (e: any) {
              console.error(e);
              setErrorMessage(e.message);
              return;
            }
          }
          router.navigate(realCallback);
        }, accountId ?? undefined);
      }
    };
    handleNewNote().catch(console.error);
  }, []);
  return <Box>{errorMessage ? <Box>{errorMessage}</Box> : <PageLoading />}</Box>;
};

export default CustomAppCreatePage;
