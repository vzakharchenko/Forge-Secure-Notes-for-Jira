// models
import { FocusEventHandler, ReactNode } from "react";
import {
  ActionMeta,
  GroupBase,
  InputActionMeta,
  MenuPlacement,
  MenuPosition,
  MultiValue,
  Options,
  OptionsOrGroups,
} from "@atlaskit/react-select";

export interface MultiAutocompleteProps<Option> {
  label?: string | ReactNode;
  name?: string;
  placeholder?: string;
  defaultOptions?: OptionsOrGroups<Option, GroupBase<Option>> | boolean;
  value?: MultiValue<Option>;
  defaultValue?: MultiValue<Option>;
  errorMessage?: string;
  helperMessage?: string;
  validMessage?: string;
  menuIsOpen?: boolean;
  autoFocus?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  openMenuOnFocus?: boolean;
  minMenuHeight?: number;
  maxMenuHeight?: number;
  menuPlacement?: MenuPlacement;
  menuPosition?: MenuPosition;
  loadOptions?: (
    inputValue: string,
    callback: (options: Options<Option>) => void,
  ) => Promise<Options<Option>> | void;
  onChange?: (newValue: MultiValue<Option>, actionMeta: ActionMeta<Option>) => void;
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  className?: string;
  selectClassName?: string;
  appearance?: "default" | "subtle" | "none";
  isRequired?: boolean;
  isScrollable?: boolean;
  maxScrollableHeight?: string;
  formatOptionLabel?: (data: Option) => ReactNode;
  testId?: string;
}

export interface FormMultiAutocompleteProps<Option> extends Omit<
  MultiAutocompleteProps<Option>,
  "name" | "errorMessage"
> {
  name: string;
  isRequired?: boolean;
}
