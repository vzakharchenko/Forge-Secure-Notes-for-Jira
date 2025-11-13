// libs
import React from "react";

// models
import { PageLoadingProps } from "./models";

// components
import Spinner from "@atlaskit/spinner";
import { Stack, Text } from "@atlaskit/primitives";

const PageLoading = ({ size = "large", text = "" }: PageLoadingProps) => {
  return (
    <Stack space="space.300" alignInline="center">
      <Spinner size={size} />
      {Boolean(text) && <Text>{text}</Text>}
    </Stack>
  );
};

export default PageLoading;
