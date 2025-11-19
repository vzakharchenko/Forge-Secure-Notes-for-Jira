// libs
import React, { useCallback } from "react";

// models
import { FormRadioGroupProps } from "./models";

// components
import { Field } from "@atlaskit/form";
import RadioGroup from "./RadioGroup";

const FormRadioGroup = ({
  label,
  name,
  defaultValue = null,
  onChange,
  isRequired,
  isDisabled,
  ...rest
}: FormRadioGroupProps) => {
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
        <RadioGroup
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

export default FormRadioGroup;
