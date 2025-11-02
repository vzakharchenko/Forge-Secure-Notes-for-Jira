import React from "react";
import { Box, Stack } from "@atlaskit/primitives";

const CenterDiv = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box padding={"space.075"}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "90vh",
        }}
      >
        <Stack alignBlock={"center"} alignInline={"center"}>
          {children}
        </Stack>
      </div>
    </Box>
  );
};

export default CenterDiv;
