// libs
import React, { useEffect, useState } from "react";
import { router } from "@forge/bridge";
import { useNavigate, useParams, useSearchParams } from "react-router";

// constants
import { GLOBAL_ROUTES } from "@src/modules/AuditGlobal/constants/Routes";
import { showNewIssueModal } from "@src/utils/ModalUtils";
import { NewCustomAppSecurityNote, NewSecurityNote } from "@shared/dto";
import { Box } from "@atlaskit/primitives";
import PageLoading from "../../../../../components/loaders/PageLoading/PageLoading";
import { getServerInfo } from "../../../../../api/jira/user";
import { createAppSecureNote } from "../../../../../api/notes";
import SecretPage from "../LinkPage/SecretPage";
import CenterDiv from "@src/components/CenterDiv";

const CustomAppViewPage = () => {
  const params = useParams();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [searchParams] = useSearchParams();
  const appId = params.appId;
  const envId = params.envId;
  const recordId = params.recordId;
  const state = searchParams.get("state");
  const navigateFunc = async () => {
    if (!appId) {
      setErrorMessage("No app ID found");
    } else if (!envId) {
      setErrorMessage("No forge environment found.");
    } else if (!recordId) {
      setErrorMessage("No record id found.");
    } else {
      const realCallback = `/jira/apps/${appId}/${envId}/callback?state=${state ?? "once"}&event=viewed`;
      router.navigate(realCallback);
    }
  };
  if (errorMessage) {
    return (
      <CenterDiv>
        <Box>Account is empty</Box>
      </CenterDiv>
    );
  }
  return (
    <SecretPage recordId={params.recordId} navigate={navigateFunc} closeNavigate={navigateFunc} />
  );
};

export default CustomAppViewPage;
