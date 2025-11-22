import React from "react";
import Spinner from "@atlaskit/spinner";
import { Box, Stack } from "@atlaskit/primitives";

import CenterDiv from "./CenterDiv";

const Loading = ({ text }: { text?: string }) => {
  return (
    <div
      style={{
        minHeight: 200,
        height: "100%",
      }}
    >
      <CenterDiv>
        <Box padding={"space.075"}>
          <Stack alignBlock={"center"} alignInline={"center"}>
            <Spinner size={"xlarge"} />
            {text ? <p style={{ textAlign: "center" }}>{text}</p> : null}
          </Stack>
        </Box>
      </CenterDiv>
    </div>
  );
};

export default Loading;
