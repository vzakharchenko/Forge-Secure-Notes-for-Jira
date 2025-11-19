// libs
import { AnyObject, ObjectSchema, ValidationError } from "yup";

// helpers
import { deepTrim } from "@src/shared/utils/string";
import { handleServerFormValidation } from "@src/shared/utils/errors";

// models
import { ServerError } from "@src/shared/models/remoteClient";
import { FormApi } from "@atlaskit/form";

export const onFormSubmit =
  <FormFields extends AnyObject>(
    onSubmit: (data: FormFields, form: FormApi<FormFields>) => Promise<void>,
    schema: ObjectSchema<FormFields>,
  ) =>
  async (values: FormFields, form: FormApi<FormFields>) => {
    try {
      const trimmedValues = deepTrim(values);
      await validateFormFields(trimmedValues as FormFields, schema);
      await onSubmit(trimmedValues as FormFields, form).catch((error) => {
        const formattedErrors = formatFormValidationErrors(error);
        if (formattedErrors) throw formattedErrors;
      });
    } catch (errors) {
      return errors;
    }
  };

const formValidateErrorHandler = (errors: ValidationError) =>
  errors.inner.reduce(
    (allErrors, currentError) => ({
      ...allErrors,
      [currentError.path as string]: currentError.message,
    }),
    {},
  );

export const validateFormFields = async <FormFields extends AnyObject>(
  formFields: FormFields,
  schema: ObjectSchema<FormFields>,
) =>
  schema.validate(formFields, { abortEarly: false }).catch((errors) => {
    throw formValidateErrorHandler(errors);
  });

export const formatFormValidationErrors = (error: ServerError | null) => {
  if (error === null) return null;
  const validationErrors = handleServerFormValidation(error);
  if (!validationErrors) return null;
  return Object.entries(validationErrors).reduce<Record<string, string>>((acc, [key, value]) => {
    acc[key] = value[0] || "";
    return acc;
  }, {});
};
