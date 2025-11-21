// libs
import React, { useMemo, useCallback } from "react";

// helpers
import { useNavigate, useLocation } from "react-router-dom";
import { useProjectIssuesList } from "./hooks/useProjectIssuesList";

// models
import { ProjectIssuesListProps } from "./models";

// components
import { Box, Stack, Text } from "@atlaskit/primitives";
import Button from "@atlaskit/button/new";
import Spinner from "@atlaskit/spinner";
import { token } from "@atlaskit/tokens";
import DynamicTable from "@atlaskit/dynamic-table";
import type { HeadType, RowType } from "@atlaskit/dynamic-table/types";
import PageHeader from "@src/modules/AuditGlobal/components/PageHeader/PageHeader";
import { openIssueModal } from "@src/modules/AuditGlobal/components/AuditTable/helpers";

const ProjectIssuesList = ({
  type,
  title,
  emptyMessage,
  loadingMessage,
  tableLabel,
  detailPathPrefix,
  detailPathSegment,
  onItemClick,
  DetailPageComponent,
  timezone,
}: ProjectIssuesListProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, isLoading } = useProjectIssuesList(type, detailPathSegment);

  const handleItemActionClick = useCallback(
    (key: string) => {
      navigate(`${detailPathPrefix}/${detailPathSegment}/${key}`);
    },
    [navigate, detailPathPrefix, detailPathSegment],
  );

  const handleItemClick = useCallback(
    (key: string) => {
      if (onItemClick) {
        onItemClick(key);
      } else if (type === "issue") {
        openIssueModal(key);
      }
    },
    [onItemClick, type],
  );

  // Define table headers
  const head: HeadType = useMemo(
    () => ({
      cells: [
        {
          key: "key",
          content: type === "issue" ? "Issue Key" : "Project Key",
          isSortable: false,
        },
        {
          key: "actions",
          content: "Actions",
          isSortable: false,
        },
      ],
    }),
    [type],
  );

  // Transform items into table rows
  const rows: RowType[] = useMemo(
    () =>
      items.map((item) => ({
        key: item.key,
        cells: [
          {
            key: "key",
            content:
              type === "issue" ? (
                <Box
                  onClick={() => handleItemClick(item.key)}
                  style={{
                    color: token("color.link", "#0052CC"),
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  <Text>{item.key}</Text>
                </Box>
              ) : (
                <Text>{item.key}</Text>
              ),
          },
          {
            key: "actions",
            content: (
              <Button
                appearance="primary"
                onClick={() => handleItemActionClick(item.key)}
                aria-label={`View details for ${item.key}`}
              >
                View details
              </Button>
            ),
          },
        ],
      })),
    [items, type, handleItemClick, handleItemActionClick],
  );

  // Check if we are on the detail page
  const isDetailPage =
    location.pathname.includes(`/${detailPathSegment}/`) && location.pathname !== detailPathPrefix;
  const keyMatch = location.pathname.match(new RegExp(`/${detailPathSegment}/([^/]+)`));
  const currentKey = keyMatch ? keyMatch[1] : null;

  // If we are on the detail page, render DetailPageComponent immediately
  if (isDetailPage && currentKey) {
    return <DetailPageComponent key={location.pathname} timezone={timezone} />;
  }

  return (
    <Box padding="space.400">
      <Stack space="space.400">
        <PageHeader title={title} />
        {isLoading ? (
          <Box padding="space.400" style={{ textAlign: "center" }}>
            <Stack space="space.400" alignInline="center">
              <Spinner size="large" />
              <Text>{loadingMessage}</Text>
            </Stack>
          </Box>
        ) : items.length === 0 ? (
          <Box
            padding="space.400"
            style={{
              background: token("elevation.surface.sunken", "#DFE1E6"),
              borderRadius: "3px",
              textAlign: "center",
            }}
          >
            <Text>{emptyMessage}</Text>
          </Box>
        ) : (
          <DynamicTable head={head} rows={rows} label={tableLabel} />
        )}
      </Stack>
    </Box>
  );
};

export default ProjectIssuesList;
