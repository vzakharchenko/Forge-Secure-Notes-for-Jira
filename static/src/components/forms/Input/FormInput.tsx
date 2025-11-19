// libs
import React, { useCallback } from "react";

// models
import { FormInputProps } from "./models";

// components
import { Field } from "@atlaskit/form";
import Input from "./Input";

const FormInput = ({
  label,
  name,
  defaultValue = "",
  isRequired,
  isDisabled,
  onChange,
  ...rest
}: FormInputProps) => {
  const onFieldChange = useCallback(
    (controllerCallback: (...event: any[]) => void) => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
          onChange(e);
        }

        controllerCallback(e);
      };
    },
    [onChange],
  );

  return (
    <Field
      aria-required={isRequired}
      name={name}
      label={label}
      defaultValue={defaultValue}
      isRequired={isRequired}
      isDisabled={isDisabled}
    >
      {({ fieldProps: { id, onChange: onFormFieldChange, ...restProps }, error }) => (
        <Input
          {...rest}
          {...restProps}
          name={id}
          errorMessage={error}
          onChange={onFieldChange(onFormFieldChange)}
        />
      )}
    </Field>
  );
};

export default FormInput;
