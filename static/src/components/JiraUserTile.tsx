// libs
import React from "react";
import styled from "styled-components";

// components
import Avatar from "@atlaskit/avatar";
import { Inline } from "@atlaskit/primitives";

interface JiraUserTileProps {
  avatarUrl?: string;
  displayName?: string;
}

const TruncateStyles = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: inherit;
`;

const JiraUserTile = ({ avatarUrl, displayName }: JiraUserTileProps) => {
  return (
    <Inline space="space.050" alignBlock="center">
      <Avatar size="small" src={avatarUrl} name={displayName ?? ""} />
      <TruncateStyles title={displayName}>{displayName ?? "Unknown User"}</TruncateStyles>
    </Inline>
  );
};

export default JiraUserTile;
