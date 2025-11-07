import React, { useEffect, useState } from "react";
import { Box, Stack, Text } from "@atlaskit/primitives";
import Button from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import { invoke, showFlag } from "@forge/bridge";
import { token } from "@atlaskit/tokens";
import { ResolverNames } from "../../../shared/ResolverNames";
import { ProjectIssue } from "../../../shared/responses/ProjectIssue";
import { useNavigate, useLocation } from "react-router-dom";
import Table, { THead, TBody, Row, Cell, HeadCell } from "@atlaskit/table";
import IssueAuditPage from "./IssueAuditPage";
import { GLOBAL_ROUTES } from "./Routes";

export default function MyIssueHistoryPage() {
  const location = useLocation();
  const [issues, setIssues] = useState<{ issueKey: string; issueId: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.pathname.includes("/issue/")) {
      fetchIssues();
    }
  }, [location.pathname]);

  const fetchIssues = async () => {
    setIsLoading(true);
    try {
      const response = await invoke<ProjectIssue>(ResolverNames.AUDIT_ISSUES_AND_PROJECTS);

      if (response.isError) {
        showFlag({
          id: "loadIssues",
          title: "Failed to load issues",
          description: response.message ?? "Failed to load issues",
          type: "error",
          appearance: "error",
          isAutoDismiss: true,
        });
        return;
      }

      const uniqueIssues = Array.from(
        new Map(
          (response.result ?? [])
            .filter((item) => item.issueKey)
            .map((item) => [item.issueKey, { issueKey: item.issueKey!, issueId: item.issueId! }]),
        ).values(),
      );
      setIssues(uniqueIssues);
    } catch (error: any) {
      console.error("Error fetching issues:", error);
      showFlag({
        id: "loadIssues",
        title: "Failed to load issues",
        description: error.message ?? "Failed to load issues",
        type: "error",
        appearance: "error",
        isAutoDismiss: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssueClick = (issueKey: string) => {
    // Use absolute path for navigation
    navigate(`${GLOBAL_ROUTES.myIssue.route}/issue/${issueKey}`);
  };

  // Check if we are on the issue detail page
  // Path can be: /myIssue/issue/TEST-123
  const isDetailPage =
    location.pathname.includes("/issue/") && location.pathname !== GLOBAL_ROUTES.myIssue.route;
  const issueKeyMatch = location.pathname.match(/\/issue\/([^/]+)/);
  const currentIssueKey = issueKeyMatch ? issueKeyMatch[1] : null;

  // If we are on the detail page, render IssueAuditPage immediately
  if (isDetailPage && currentIssueKey) {
    return <IssueAuditPage key={location.pathname} />;
  }

  // Show spinner only if we are loading the issues list
  if (isLoading) {
    return (
      <Box padding="space.400" style={{ textAlign: "center" }}>
        <Stack space="space.400" alignInline="center">
          <Spinner size="large" />
          <Text>Loading issues...</Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box padding="space.400">
      <Stack space="space.400">
        <Text size="large" weight="bold">
          My Issue History
        </Text>
        {issues.length === 0 ? (
          <Box
            padding="space.400"
            style={{
              background: token("elevation.surface.sunken", "#DFE1E6"),
              borderRadius: "3px",
              textAlign: "center",
            }}
          >
            <Text>No issues found</Text>
          </Box>
        ) : (
          <Table>
            <THead>
              <HeadCell>Issue Key</HeadCell>
              <HeadCell>Actions</HeadCell>
            </THead>
            <TBody>
              {issues.map((issue) => (
                <Row key={issue.issueKey}>
                  <Cell>
                    <Button
                      appearance="link"
                      onClick={() => handleIssueClick(issue.issueKey)}
                      style={{ padding: 0, textAlign: "left" }}
                    >
                      {issue.issueKey}
                    </Button>
                  </Cell>
                  <Cell>
                    <Button appearance="primary" onClick={() => handleIssueClick(issue.issueKey)}>
                      View Details
                    </Button>
                  </Cell>
                </Row>
              ))}
            </TBody>
          </Table>
        )}
      </Stack>
    </Box>
  );
}
