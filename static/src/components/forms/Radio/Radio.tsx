// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

// libs
import React from "react";

// models
import { RadioProps } from "./models";

// components
import { Radio as RadioAtlaskit } from "@atlaskit/radio";
import { ErrorMessage, HelperMessage, ValidMessage } from "@atlaskit/form";
import { Stack } from "@atlaskit/primitives";

const Radio = ({
  radioClassName,
  errorMessage,
  helperMessage,
  validMessage,
  onChange = () => {},
  ...rest
}: RadioProps) => {
  return (
    <Stack>
      <RadioAtlaskit className={radioClassName} onChange={onChange} {...rest} />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {helperMessage && !errorMessage && <HelperMessage>{helperMessage}</HelperMessage>}
      {validMessage && !errorMessage && <ValidMessage>{validMessage}</ValidMessage>}
    </Stack>
  );
};

export default Radio;
