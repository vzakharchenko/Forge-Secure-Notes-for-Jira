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
import ProjectAuditPage from "./ProjectAuditPage";
import { GLOBAL_ROUTES } from "./Routes";

export default function MyProjectHistoryPage() {
  const location = useLocation();
  const [projects, setProjects] = useState<{ projectKey: string; projectId: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load data only if we are on the main projects list page (not on detail page)
    if (!location.pathname.includes("/project/")) {
      fetchProjects();
    }
  }, [location.pathname]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await invoke<ProjectIssue>(ResolverNames.AUDIT_ISSUES_AND_PROJECTS);

      if (response.isError) {
        showFlag({
          id: "loadProjects",
          title: "Failed to load projects",
          description: response.message ?? "Failed to load projects",
          type: "error",
          appearance: "error",
          isAutoDismiss: true,
        });
        return;
      }

      const uniqueProjects = Array.from(
        new Map(
          (response.result ?? [])
            .filter((item) => item.projectKey)
            .map((item) => [
              item.projectKey,
              { projectKey: item.projectKey!, projectId: item.projectId! },
            ]),
        ).values(),
      );
      setProjects(uniqueProjects);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      showFlag({
        id: "loadProjects",
        title: "Failed to load projects",
        description: error.message ?? "Failed to load projects",
        type: "error",
        appearance: "error",
        isAutoDismiss: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectClick = (projectKey: string) => {
    // Use absolute path for navigation
    navigate(`${GLOBAL_ROUTES.myProject.route}/project/${projectKey}`);
  };

  // Check if we are on the project detail page
  // Path can be: /myProject/project/TEST
  const isDetailPage =
    location.pathname.includes("/project/") && location.pathname !== GLOBAL_ROUTES.myProject.route;
  const projectKeyMatch = location.pathname.match(/\/project\/([^/]+)/);
  const currentProjectKey = projectKeyMatch ? projectKeyMatch[1] : null;

  // If we are on the detail page, render ProjectAuditPage immediately
  if (isDetailPage && currentProjectKey) {
    return <ProjectAuditPage key={location.pathname} />;
  }

  // Show spinner only if we are loading the projects list
  if (isLoading) {
    return (
      <Box padding="space.400" style={{ textAlign: "center" }}>
        <Stack space="space.400" alignInline="center">
          <Spinner size="large" />
          <Text>Loading projects...</Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box padding="space.400">
      <Stack space="space.400">
        <Text size="large" weight="bold">
          My Project History
        </Text>
        {projects.length === 0 ? (
          <Box
            padding="space.400"
            style={{
              background: token("elevation.surface.sunken", "#DFE1E6"),
              borderRadius: token("border.radius.200", "3px"),
              textAlign: "center",
            }}
          >
            <Text>No projects found</Text>
          </Box>
        ) : (
          <Table>
            <THead>
              <HeadCell>Project Key</HeadCell>
              <HeadCell>Actions</HeadCell>
            </THead>
            <TBody>
              {projects.map((project) => (
                <Row key={project.projectKey}>
                  <Cell>{project.projectKey}</Cell>
                  <Cell>
                    <Button
                      appearance="primary"
                      onClick={() => handleProjectClick(project.projectKey)}
                    >
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
