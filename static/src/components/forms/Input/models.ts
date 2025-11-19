// libs
import React, { ChangeEventHandler, FocusEventHandler, MouseEventHandler, ReactNode } from "react";

export type InputType = "text" | "password" | "email" | "file" | "number";

export interface InputProps {
  value?: string;
  defaultValue?: string;
  name?: string;
  label?: string | ReactNode;
  isReadOnly?: boolean;
  type?: InputType;
  min?: string | number;
  max?: string | number;
  errorMessage?: string;
  helperMessage?: string | ReactNode;
  validMessage?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  placeholder?: string;
  accept?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  maxLength?: number;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  elemAfterInput?: React.ReactNode;
  elemBeforeInput?: React.ReactNode;
  testId?: string;
}

export interface FormInputProps extends Omit<InputProps, "name" | "errorMessage"> {
  name: string;
}
