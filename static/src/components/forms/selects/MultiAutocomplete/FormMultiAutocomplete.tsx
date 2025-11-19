// libs
import React, { useCallback } from "react";

// models
import { FormMultiAutocompleteProps } from "./models";
import { SelectOption } from "../models";
import { ValueType } from "@atlaskit/select";
import { ActionMeta, MultiValue, OnChangeValue } from "@atlaskit/react-select";

// components
import { Field } from "@atlaskit/form";
import MultiAutocomplete from "./MultiAutocomplete";

const FormMultiAutocomplete = <Option extends SelectOption>({
  onChange,
  label,
  name,
  defaultValue = [],
  isRequired,
  isDisabled,
  ...rest
}: FormMultiAutocompleteProps<Option>) => {
  const onFieldChange = useCallback(
    (
      controllerCallback: (value: React.FormEvent<HTMLInputElement> | MultiValue<Option>) => void,
    ) => {
      return (value: OnChangeValue<Option, true>, actionMeta: ActionMeta<Option>) => {
        if (onChange) {
          onChange(value, actionMeta);
        }
        controllerCallback(value);
      };
    },
    [onChange],
  );

  return (
    <Field<ValueType<Option, true>>
      aria-required={isRequired}
      name={name}
      label={label}
      defaultValue={defaultValue}
      isRequired={isRequired}
      isDisabled={isDisabled}
    >
      {({ fieldProps: { id, onChange: onFormFieldChange, ...restProps }, error }) => (
        <MultiAutocomplete<Option>
          {...rest}
          {...restProps}
          name={id}
          onChange={onFieldChange(onFormFieldChange)}
          errorMessage={error}
        />
      )}
    </Field>
  );
};

export default FormMultiAutocomplete;
