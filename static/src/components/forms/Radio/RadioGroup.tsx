// libs
import React from "react";

// models
import { RadioGroupProps } from "./models";

// styles
import "./styles.scss";

// components
import { RadioGroup as AtlasRadioGroup } from "@atlaskit/radio";
import { ErrorMessage, HelperMessage, ValidMessage } from "@atlaskit/form";
import Label from "@src/components/forms/components/Label/Label";
import { Stack } from "@atlaskit/primitives";

const RadioGroup = ({
  label,
  name,
  errorMessage,
  helperMessage,
  validMessage,
  onChange = () => {},
  isRequired,
  isRow = false,
  ...rest
}: RadioGroupProps) => {
  return (
    <div className={isRow ? "row-radio-group" : ""}>
      <Stack>
        {label && <Label id={name} label={label} isRequired={isRequired} />}
        <AtlasRadioGroup onChange={onChange} name={name} isRequired={isRequired} {...rest} />
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        {helperMessage && !errorMessage && <HelperMessage>{helperMessage}</HelperMessage>}
        {validMessage && !errorMessage && <ValidMessage>{validMessage}</ValidMessage>}
      </Stack>
    </div>
  );
};

export default RadioGroup;
