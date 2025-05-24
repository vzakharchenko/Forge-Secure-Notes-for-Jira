import Select, {OptionType} from "@atlaskit/select";
import {ErrorMessage, Field, HelperMessage, ValidMessage} from "@atlaskit/form";
import {requestJira} from "@forge/bridge";
import {SelectProps} from "@atlaskit/select/types";
import {token} from "@atlaskit/tokens";
import JiraUserTile from "./JiraUserTile";
import type {FormEvent} from "react";

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
    selectProps?: SelectProps<OptionType, boolean>;
    name: string;
    label?: string;
    defaultValue?: JiraUserPicker | null;
    isRequired?: boolean;
    helperMessage?: string;
    errorMessage?: string;
    validMessage?: string;
    onChange: (value: FormEvent<Element> | any) => void
}

const createSelectOption = (userPicker: JiraUserPicker): OptionType => ({
    label: userPicker.displayName,
    value: userPicker.accountId,
    formattedLabel: <JiraUserTile avatarUrl={userPicker.avatarUrl} displayName={userPicker.displayName} />,
    fieldValue: mapUserPickerToUser(userPicker),
});

const loadOptions = async (inputValue?: string) => {
    try {
        const response = await requestJira(`/rest/api/3/user/picker?showAvatar=true&query=${inputValue}`);
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
    defaultValue = null,
    isRequired = false,
    helperMessage,
    errorMessage,
    validMessage,
                            onChange,
}: JiraUserFieldProps) => {
    return (
        <Field
            name={name}
            label={label}
            defaultValue={defaultValue ? mapUserPickerToUser(defaultValue) : null}
            isRequired={isRequired}
        >
            {({ fieldProps, error, valid, meta }) => (
                <div>
                    <Select
                        {...selectProps}
                        loadOptions={loadOptions}
                        formatOptionLabel={({ label, formattedLabel }: OptionType) => formattedLabel ?? label}
                        defaultValue={defaultValue ? createSelectOption(defaultValue) : null}
                        onChange={value => onChange(value?.fieldValue)}
                        styles={{
                            control: baseStyles => ({
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
