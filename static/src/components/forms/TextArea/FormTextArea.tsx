// libs
import React from "react";

// models
import { FormTextAreaProps } from "./models";

// components
import { Field } from "@atlaskit/form";
import TextArea from "./TextArea";

const FormTextArea = ({
  label,
  name,
  defaultValue = "",
  isRequired,
  isDisabled,
  ...rest
}: FormTextAreaProps) => {
  return (
    <Field<string, HTMLTextAreaElement>
      aria-required={isRequired}
      name={name}
      label={label}
      defaultValue={defaultValue}
      isRequired={isRequired}
      isDisabled={isDisabled}
    >
      {({ fieldProps: { id, ...restProps }, error }) => (
        <TextArea {...rest} {...restProps} name={id} errorMessage={error} />
      )}
    </Field>
  );
};

export default FormTextArea;
