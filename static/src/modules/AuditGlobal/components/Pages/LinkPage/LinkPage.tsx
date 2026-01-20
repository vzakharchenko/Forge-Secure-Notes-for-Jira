// libs
import React from "react";
import { useNavigate, useParams } from "react-router";

// constants
import { GLOBAL_ROUTES } from "@src/modules/AuditGlobal/constants/Routes";

// components
import SecretPage from "./SecretPage";

const LinkPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const navigateFunc = () => navigate(GLOBAL_ROUTES.all.route);
  return (
    <SecretPage recordId={params.recordId} navigate={navigateFunc} actionViewed={navigateFunc} />
  );
};

export default LinkPage;
