// libs
import { ChangeEventHandler, ReactNode } from "react";

export interface RadioProps {
  name?: string;
  label?: ReactNode;
  value?: string;
  isChecked?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  radioClassName?: string;
  errorMessage?: string;
  helperMessage?: string;
  validMessage?: string;
  testId?: string;
}

export interface RadioGroupProps extends Omit<RadioProps, "radioClassName" | "value"> {
  options: RadioGroupOption[];
  value?: string | null;
  defaultValue?: string | null;
  isRow?: boolean;
}

export interface RadioGroupOption {
  isDisabled?: boolean;
  label?: ReactNode;
  name?: string;
  value: string;
  testId?: string;
}

export interface FormRadioGroupProps extends Omit<RadioGroupProps, "name" | "errorMessage"> {
  name: string;
}
