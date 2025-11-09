import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import EmptyState from "@atlaskit/empty-state";
import Button from "@atlaskit/button";

import NotFoundClosedImage from "../img/404.png";

import { GLOBAL_ROUTES } from "./Routes";
import AuditPage from "./AuditPage";
import LinkPage from "./LinkPage";

const GlobalRoute = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path={GLOBAL_ROUTES.all.route} element={<AuditPage />} />
      <Route path={GLOBAL_ROUTES.myHistory.route} element={<AuditPage />} />
      <Route path={GLOBAL_ROUTES.myIssue.route + "/*"} element={<AuditPage />} />
      <Route path={GLOBAL_ROUTES.myProject.route + "/*"} element={<AuditPage />} />
      <Route path="/userHistory" element={<AuditPage />} />
      <Route path={GLOBAL_ROUTES.record.route} element={<LinkPage />} />
      <Route
        path="*"
        element={
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
        }
      />
    </Routes>
  );
};

export default GlobalRoute;
