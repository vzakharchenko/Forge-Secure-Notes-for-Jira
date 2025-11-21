// libs
import React from "react";

// components
import { Box } from "@atlaskit/primitives";
import Heading from "@atlaskit/heading";
import { token } from "@atlaskit/tokens";

export interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

const PageHeader = ({ title, actions }: PageHeaderProps) => {
  return (
    <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Heading size="large" as="h2">
        {title}
      </Heading>
      {actions && <Box style={{ display: "flex", gap: token("space.100", "8px") }}>{actions}</Box>}
    </Box>
  );
};

export default PageHeader;
