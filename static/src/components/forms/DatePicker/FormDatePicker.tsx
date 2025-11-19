// libs
import React, { useCallback } from "react";

// helpers
import { getStartOfDayFromZonedDate } from "@src/shared/utils/date";

// models
import { FormDatePickerProps } from "./models";

// constants
import { UTC_TIMEZONE } from "@src/shared/constants/dateTime";

// components
import { Field } from "@atlaskit/form";
import DatePicker from "./DatePicker";

const FormDatePicker = ({
  onChange,
  label,
  name,
  defaultValue = "",
  onChangeModifier,
  timezone = UTC_TIMEZONE,
  isRequired,
  isDisabled,
  ...rest
}: FormDatePickerProps) => {
  const onFieldChange = useCallback(
    (controllerCallback: (value: string | React.FormEvent<HTMLInputElement>) => void) => {
      return (value: string) => {
        if (onChange) {
          onChange(value);
        }
        controllerCallback(value);
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
        <DatePicker
          {...rest}
          {...restProps}
          onChange={onFieldChange(onFormFieldChange)}
          name={id}
          errorMessage={error}
          timezone={timezone}
          onChangeModifier={
            onChangeModifier ??
            ((value: string) => (value ? getStartOfDayFromZonedDate(value, timezone) : ""))
          }
        />
      )}
    </Field>
  );
};

export default FormDatePicker;
