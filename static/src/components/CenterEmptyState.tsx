// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import React from "react";
import { Box, Stack } from "@atlaskit/primitives";
import EmptyState from "@atlaskit/empty-state";

import CenterDiv from "./CenterDiv";

const CenterEmptyState = ({ description, text }: { text: string; description?: string }) => {
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
            <EmptyState header={text} description={description} />
          </Stack>
        </Box>
      </CenterDiv>
    </div>
  );
};

export default CenterEmptyState;
