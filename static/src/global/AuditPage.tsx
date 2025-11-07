import React, { useEffect, useState } from "react";
import { Box, Stack, Text, Inline } from "@atlaskit/primitives";
import Button from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import { invoke } from "@forge/bridge";
import { token } from "@atlaskit/tokens";
import { ResolverNames } from "../../../shared/ResolverNames";
import { Bootstrap } from "../../../shared/responses/Bootstrap";
import MyHistoryPage from "./MyHistoryPage";
import MyIssueHistoryPage from "./MyIssueHistoryPage";
import MyProjectHistoryPage from "./MyProjectHistoryPage";
import UserHistoryPage from "./UserHistoryPage";
import { useLocation, useNavigate } from "react-router-dom";
import { GLOBAL_ROUTES } from "./Routes";

export default function AuditPage() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBootstrap = async () => {
      try {
        const response = await invoke<Bootstrap>(ResolverNames.BOOTSTRAP);
        setIsAdmin(response.isAdmin ?? false);
      } catch (error: any) {
        console.error("Error fetching bootstrap:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBootstrap().catch(console.error);
  }, []);

  if (isLoading) {
    return (
      <Box padding="space.400" style={{ textAlign: "center" }}>
        <Spinner size="large" />
      </Box>
    );
  }

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith(GLOBAL_ROUTES.myIssue.route)) return 1;
    if (path.startsWith(GLOBAL_ROUTES.myProject.route)) return 2;
    if (path === GLOBAL_ROUTES.myHistory.route || path === GLOBAL_ROUTES.all.route) return 0;
    if (isAdmin && path === "/userHistory") return 3;
    return 0;
  };

  const activeTab = getActiveTab();

  const handleTabClick = (index: number) => {
    switch (index) {
      case 0:
        navigate(GLOBAL_ROUTES.myHistory.route);
        break;
      case 1:
        navigate(GLOBAL_ROUTES.myIssue.route);
        break;
      case 2:
        navigate(GLOBAL_ROUTES.myProject.route);
        break;
      case 3:
        if (isAdmin) {
          navigate("/userHistory");
        }
        break;
    }
  };

  return (
    <Box padding="space.400" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Stack space="space.400">
        <Box
          style={{
            borderBottom: `2px solid ${token("color.border", "#DFE1E6")}`,
            marginBottom: token("space.300", "24px"),
          }}
        >
          <Inline space="space.100" spread="space-between" alignBlock="center">
            <Inline space="space.100">
              <Button
                appearance={activeTab === 0 ? "primary" : "subtle"}
                onClick={() => handleTabClick(0)}
              >
                My History
              </Button>
              <Button
                appearance={activeTab === 1 ? "primary" : "subtle"}
                onClick={() => handleTabClick(1)}
              >
                My Issue History
              </Button>
              <Button
                appearance={activeTab === 2 ? "primary" : "subtle"}
                onClick={() => handleTabClick(2)}
              >
                My Project History
              </Button>
              {isAdmin && (
                <Button
                  appearance={activeTab === 3 ? "primary" : "subtle"}
                  onClick={() => handleTabClick(3)}
                >
                  User History
                </Button>
              )}
            </Inline>
          </Inline>
        </Box>
        {(() => {
          const path = location.pathname;
          if (path === GLOBAL_ROUTES.myHistory.route || path === GLOBAL_ROUTES.all.route) {
            return <MyHistoryPage key={location.pathname} />;
          }
          if (path.startsWith(GLOBAL_ROUTES.myIssue.route)) {
            return <MyIssueHistoryPage key={location.pathname} />;
          }
          if (path.startsWith(GLOBAL_ROUTES.myProject.route)) {
            return <MyProjectHistoryPage key={location.pathname} />;
          }
          if (isAdmin && path === "/userHistory") {
            return <UserHistoryPage key={location.pathname} />;
          }
          return <MyHistoryPage key={location.pathname} />;
        })()}
      </Stack>
    </Box>
  );
}
