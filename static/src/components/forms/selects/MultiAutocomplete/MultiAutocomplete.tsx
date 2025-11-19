// libs
import React from "react";

// models
import { MultiAutocompleteProps } from "./models";
import { SelectOption } from "../models";

// constants
import { DEFAULT_DROPDOWN_Z_INDEX } from "@src/shared/constants/common";
import { DEFAULT_MAX_MENU_LIST_HEIGHT } from "../constants";

// components
import { AsyncSelect } from "@atlaskit/select";
import { ErrorMessage, HelperMessage, ValidMessage } from "@atlaskit/form";
import Label from "@src/components/forms/components/Label/Label";
import { Stack } from "@atlaskit/primitives";

const MultiAutocomplete = <Option extends SelectOption>({
  label,
  name,
  errorMessage,
  helperMessage,
  validMessage,
  isRequired,
  isScrollable = false,
  maxScrollableHeight = "86px",
  menuPosition = "fixed",
  ...rest
}: MultiAutocompleteProps<Option>) => {
  return (
    <Stack>
      {label && <Label id={name} label={label} isRequired={isRequired} />}
      <AsyncSelect<Option, true>
        isMulti
        inputId={name}
        name={name}
        cacheOptions
        menuPosition={menuPosition}
        isRequired={isRequired}
        isInvalid={Boolean(errorMessage)}
        styles={{
          control: (base) =>
            isScrollable ? { ...base, overflowY: "auto", maxHeight: maxScrollableHeight } : base,
          indicatorsContainer: (base) =>
            isScrollable ? { ...base, alignSelf: "start", position: "sticky", top: 0 } : base,
          menuPortal: (base) => ({ ...base, zIndex: DEFAULT_DROPDOWN_Z_INDEX }),
          menu: (base) => ({ ...base, width: "max-content", minWidth: "100%", maxWidth: "100%" }),
          menuList: (base) => ({ ...base, maxHeight: DEFAULT_MAX_MENU_LIST_HEIGHT }),
          option: (base) => ({ ...base, wordBreak: "break-word" }),
        }}
        {...rest}
      />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {helperMessage && !errorMessage && <HelperMessage>{helperMessage}</HelperMessage>}
      {validMessage && !errorMessage && <ValidMessage>{validMessage}</ValidMessage>}
    </Stack>
  );
};

export default MultiAutocomplete;
