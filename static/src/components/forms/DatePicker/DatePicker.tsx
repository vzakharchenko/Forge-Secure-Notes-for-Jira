// libs
import React from "react";
import { parseISO } from "date-fns";

// helpers
import { formatDateWithTimezoneAndFormat } from "@src/shared/utils/date";
import { useCurrentDateObserver } from "@src/shared/hooks/useCurrentDateObserver";

// models
import { DatePickerProps } from "./models";

// constants
import { DATE_FORMATS } from "@src/shared/constants/formates";
import { UTC_TIMEZONE } from "@src/shared/constants/dateTime";

// components
import { ErrorMessage, HelperMessage, RequiredAsterisk, ValidMessage } from "@atlaskit/form";
import { DatePicker as AtlasDatePicker } from "@atlaskit/datetime-picker";
import { Stack } from "@atlaskit/primitives";

const DatePicker = ({
  label,
  name,
  value,
  defaultValue,
  minDate,
  maxDate,
  errorMessage,
  helperMessage,
  validMessage,
  onChange = () => {},
  onChangeModifier,
  dateFormat = DATE_FORMATS.DATE,
  placeholder = "YYYY-MM-DD",
  isRequired,
  timezone = UTC_TIMEZONE,
  ...rest
}: DatePickerProps) => {
  const ref = useCurrentDateObserver(timezone);

  const handleChange = (val: string) => onChange(onChangeModifier ? onChangeModifier(val) : val);

  return (
    <Stack ref={ref}>
      {label && (
        <label htmlFor={name} className="mb-1 text-xs font-semibold text-at-text-subtle">
          {label}
          {isRequired && <RequiredAsterisk />}
        </label>
      )}
      <AtlasDatePicker
        id={name}
        value={
          value ? formatDateWithTimezoneAndFormat(value, timezone, DATE_FORMATS.SHORT_DATE) : ""
        }
        defaultValue={
          defaultValue
            ? formatDateWithTimezoneAndFormat(defaultValue, timezone, DATE_FORMATS.SHORT_DATE)
            : ""
        }
        minDate={
          minDate ? formatDateWithTimezoneAndFormat(minDate, timezone, DATE_FORMATS.SHORT_DATE) : ""
        }
        maxDate={
          maxDate ? formatDateWithTimezoneAndFormat(maxDate, timezone, DATE_FORMATS.SHORT_DATE) : ""
        }
        onChange={handleChange}
        parseInputValue={(date: string) => parseISO(date)}
        dateFormat={dateFormat}
        placeholder={placeholder}
        isInvalid={Boolean(errorMessage)}
        testId="date-picker"
        {...rest}
      />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {helperMessage && !errorMessage && <HelperMessage>{helperMessage}</HelperMessage>}
      {validMessage && <ValidMessage>{validMessage}</ValidMessage>}
    </Stack>
  );
};

export default DatePicker;
