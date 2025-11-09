import Select, { OptionType } from "@atlaskit/select";
import { ErrorMessage, Field, HelperMessage, ValidMessage } from "@atlaskit/form";
import { requestJira } from "@forge/bridge";
import { SelectProps } from "@atlaskit/select/types";
import { token } from "@atlaskit/tokens";
import JiraUserTile from "./JiraUserTile";
import type { FormEvent } from "react";

const mapUserPickerToUser = (user?: JiraUserPicker): JiraUser | null => {
  if (!user) return null;
  return {
    id: user.accountId,
    name: user.displayName,
    avatarUrl: user.avatarUrl,
  };
};

interface JiraUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface JiraUserPicker {
  accountId: string;
  displayName: string;
  avatarUrl?: string;
}

interface JiraUserFieldProps {
  selectProps?: SelectProps<OptionType, any>;
  name: string;
  label?: string;
  /**
   * When false (default) component works as single-select.
   * When true — as multi-select.
   */
  isMulti?: boolean;
  /**
   * Single or multiple default values depending on isMulti
   */
  defaultValue?: JiraUserPicker | JiraUserPicker[] | null;
  isRequired?: boolean;
  helperMessage?: string;
  errorMessage?: string;
  validMessage?: string;
  /**
   * onChange will receive:
   *  - JiraUser | null for single select
   *  - JiraUser[] for multi select
   */
  onChange: (value: FormEvent | any) => void;
}

const createSelectOption = (userPicker: JiraUserPicker): OptionType => ({
  label: userPicker.displayName,
  value: userPicker.accountId,
  formattedLabel: (
    <JiraUserTile avatarUrl={userPicker.avatarUrl} displayName={userPicker.displayName} />
  ),
  fieldValue: mapUserPickerToUser(userPicker),
});

const loadOptions = async (inputValue?: string) => {
  try {
    const response = await requestJira(
      `/rest/api/3/user/picker?showAvatar=true&query=${inputValue}`,
    );
    const data = await response.json();
    return data.users.map(createSelectOption);
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const JiraUserSelect = ({
  selectProps,
  name,
  label,
  isMulti = false,
  defaultValue = null,
  isRequired = false,
  helperMessage,
  errorMessage,
  validMessage,
  onChange,
}: JiraUserFieldProps) => {
  const defaultFieldValue = isMulti
    ? Array.isArray(defaultValue)
      ? defaultValue.map(mapUserPickerToUser).filter(Boolean)
      : []
    : defaultValue
      ? mapUserPickerToUser(defaultValue)
      : null;

  const defaultSelectValue = isMulti
    ? Array.isArray(defaultValue)
      ? defaultValue.map(createSelectOption)
      : []
    : defaultValue
      ? createSelectOption(defaultValue)
      : null;

  return (
    <Field
      name={name}
      label={label}
      defaultValue={defaultFieldValue as any}
      isRequired={isRequired}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
      {({ fieldProps, error, valid, meta }) => (
        <div>
          <Select
            {...selectProps}
            loadOptions={loadOptions}
            formatOptionLabel={({ label, formattedLabel }: OptionType) => formattedLabel ?? label}
            isMulti={isMulti}
            defaultValue={defaultSelectValue as any}
            // @ts-ignore
            onChange={(value) => {
              if (isMulti) {
                const arr = Array.isArray(value) ? value : [];
                // pass JiraUser[] to parent
                onChange(arr.map((v) => v.fieldValue).filter(Boolean));
              } else {
                // pass JiraUser | null to parent
                onChange(value?.fieldValue ?? null);
              }
            }}
            closeMenuOnSelect={!isMulti}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                border: `1px solid ${token("color.border")}`,
              }),
            }}
          />
          {helperMessage && <HelperMessage>{helperMessage}</HelperMessage>}
          {errorMessage && error && !valid && <ErrorMessage>{errorMessage}</ErrorMessage>}
          {validMessage && valid && meta.dirty && <ValidMessage>{validMessage}</ValidMessage>}
        </div>
      )}
    </Field>
  );
};

export default JiraUserSelect;
