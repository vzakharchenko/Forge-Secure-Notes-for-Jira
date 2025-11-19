// libs
import { ChangeEventHandler, FocusEventHandler, MouseEventHandler, ReactNode } from "react";

type TextAreaResize = "auto" | "vertical" | "horizontal" | "smart" | "none";

export interface TextAreaProps {
  value?: string;
  defaultValue?: string;
  name?: string;
  label?: string | ReactNode;
  isReadOnly?: boolean;
  errorMessage?: string;
  helperMessage?: string;
  validMessage?: string;
  isDisabled?: boolean;
  placeholder?: string;
  containerClassName?: string;
  accept?: string;
  autoFocus?: boolean;
  maxLength?: number;
  resize?: TextAreaResize;
  minimumRows?: number;
  maxHeight?: string;
  onClick?: MouseEventHandler<HTMLTextAreaElement>;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  isRequired?: boolean;
  testId?: string;
}

export interface FormTextAreaProps extends Omit<TextAreaProps, "name" | "errorMessage"> {
  name: string;
}
