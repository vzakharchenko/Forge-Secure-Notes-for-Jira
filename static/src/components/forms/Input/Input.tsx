// libs
import React from "react";

// models
import { InputProps } from "./models";

// constants
import { MAX_SAFE_INTEGER } from "@src/shared/constants/common";

// components
import Textfield from "@atlaskit/textfield";
import { ErrorMessage, HelperMessage, ValidMessage } from "@atlaskit/form";
import Label from "@src/components/forms/components/Label/Label";
import { Stack } from "@atlaskit/primitives";

const Input = ({
  label,
  name,
  type,
  max,
  errorMessage,
  helperMessage,
  validMessage,
  isRequired,
  onChange = () => {},
  autoComplete = "off",
  ...rest
}: InputProps) => {
  return (
    <Stack>
      {label && <Label id={name} label={label} isRequired={isRequired} />}
      <Textfield
        name={name}
        id={name}
        type={type}
        autoComplete={autoComplete}
        onChange={onChange}
        isRequired={isRequired}
        isInvalid={Boolean(errorMessage)}
        max={type === "number" ? (max ?? MAX_SAFE_INTEGER) : max}
        {...rest}
      />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {helperMessage && !errorMessage && <HelperMessage>{helperMessage}</HelperMessage>}
      {validMessage && !errorMessage && <ValidMessage>{validMessage}</ValidMessage>}
    </Stack>
  );
};

export default Input;
