// libs
import React from "react";

// models
import { TextAreaProps } from "./models";

// components
import { ErrorMessage, HelperMessage, ValidMessage } from "@atlaskit/form";
import { default as Textarea } from "@atlaskit/textarea";
import Label from "@src/components/forms/components/Label/Label";
import { Stack } from "@atlaskit/primitives";

const TextArea = ({
  label,
  name,
  errorMessage,
  helperMessage,
  validMessage,
  isRequired,
  minimumRows,
  resize = "vertical",
  onChange = () => {},
  ...rest
}: TextAreaProps) => {
  return (
    <Stack>
      {label && <Label id={name} label={label} isRequired={isRequired} />}
      <Textarea
        name={name}
        id={name}
        onChange={onChange}
        resize={resize}
        minimumRows={minimumRows}
        isRequired={isRequired}
        isInvalid={Boolean(errorMessage)}
        {...rest}
      />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {helperMessage && !errorMessage && <HelperMessage>{helperMessage}</HelperMessage>}
      {validMessage && !errorMessage && <ValidMessage>{validMessage}</ValidMessage>}
    </Stack>
  );
};

export default TextArea;
