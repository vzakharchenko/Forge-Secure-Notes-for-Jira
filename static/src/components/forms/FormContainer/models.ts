// libs
import { ReactElement } from "react";

// models
import { AnyObject, ObjectSchema } from "yup";
import { Align } from "@atlaskit/form/dist/types/types";
import { Appearance } from "@atlaskit/button/new";
import { FormApi } from "@atlaskit/form";

export interface FormContainerProps<FormFields extends AnyObject> {
  schema: ObjectSchema<FormFields>;
  onSubmit: (data: FormFields, form: FormApi<FormFields>) => Promise<void>;
  onCancel?: () => void;
  title?: string;
  titleContent?: string | ReactElement;
  cancelText?: string;
  submitText?: string;
  cancelButtonAppearance?: Appearance;
  submitButtonAppearance?: Appearance;
  isSubmitButtonDisabled?: boolean;
  footerAlign?: Align;
  shouldDisableSubmitOnDirty?: boolean;
  className?: string;
  children?: string | ReactElement | ReactElement[];
}
