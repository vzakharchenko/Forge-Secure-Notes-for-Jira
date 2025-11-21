import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import EmptyState from "@atlaskit/empty-state";
import Button from "@atlaskit/button/new";

import NotFoundClosedImage from "@src/img/404.png";

import { GLOBAL_ROUTES } from "@src/modules/Administration/constants/Routes";
import MyHistoryPage from "@src/modules/Administration/components/Pages/MyHistoryPage";
import MyIssueHistoryPage from "@src/modules/Administration/components/Pages/MyIssueHistoryPage";
import MyProjectHistoryPage from "@src/modules/Administration/components/Pages/MyProjectHistoryPage";
import UserHistoryPage from "@src/modules/Administration/components/Pages/UserHistoryPage";
import LinkPage from "@src/modules/Administration/components/Pages/LinkPage";

const GlobalRoute = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path={GLOBAL_ROUTES.all.route} element={<MyHistoryPage />} />
      <Route path={GLOBAL_ROUTES.myHistory.route} element={<MyHistoryPage />} />
      <Route path={GLOBAL_ROUTES.myIssue.route + "/*"} element={<MyIssueHistoryPage />} />
      <Route path={GLOBAL_ROUTES.myProject.route + "/*"} element={<MyProjectHistoryPage />} />
      <Route path="/userHistory" element={<UserHistoryPage />} />
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
                Go to main page
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
