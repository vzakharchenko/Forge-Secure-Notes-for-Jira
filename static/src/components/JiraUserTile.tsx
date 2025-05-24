import React from "react";
import Avatar from "@atlaskit/avatar";
import {Inline} from "@atlaskit/primitives";
import {token} from "@atlaskit/tokens";
import styled from "styled-components";
import {UserIcon} from "./Icons";

interface JiraUserTileProps {
    avatarUrl?: string;
    displayName?: string;
    maxWidth?: number;
}

const TruncateStyles = styled.span`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    max-width: inherit;
`;

const UnassignedAvatar = styled.div`
    border: 1px dashed ${token("color.border")};
    border-radius: 15px;
    display: flex;
    padding: ${token("space.050")};
`;

const JiraUserTile = ({ avatarUrl, displayName }: JiraUserTileProps) => {
    if (!avatarUrl && !displayName) {
        return (
            <Inline space="space.050" alignBlock="center">
                <UnassignedAvatar>
                    <UserIcon size="xs" colorType={token("color.background.accent.gray.subtle")} />
                </UnassignedAvatar>

                <span>Unassigned</span>
            </Inline>
        );
    }
    return (
        <Inline space="space.050" alignBlock="center">
            <Avatar size="small" src={avatarUrl} name={displayName ?? ""} />
            <TruncateStyles
                title={displayName} // Show full name on hover
            >
                {displayName}
            </TruncateStyles>
        </Inline>
    );
};

export default JiraUserTile;
