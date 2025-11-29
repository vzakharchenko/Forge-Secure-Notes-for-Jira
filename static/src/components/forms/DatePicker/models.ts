// libs
import { ReactNode } from "react";

// models
import { DatePickerProps as AtlasDatePickerProps } from "@atlaskit/datetime-picker";

export interface DatePickerProps extends Omit<
  AtlasDatePickerProps,
  "label" | "minDate" | "maxDate"
> {
  label?: string | ReactNode;
  errorMessage?: string;
  helperMessage?: string;
  validMessage?: string;
  isRequired?: boolean;
  timezone?: string;
  onChangeModifier?: (value: string) => string;
  minDate?: string | Date;
  maxDate?: string | Date;
}

export interface FormDatePickerProps extends Omit<DatePickerProps, "name" | "errorMessage"> {
  defaultValue?: string;
  name: string;
}
