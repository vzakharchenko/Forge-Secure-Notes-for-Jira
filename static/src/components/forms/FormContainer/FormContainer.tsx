// libs
import React from "react";
import { AnyObject } from "yup";

// helpers
import { onFormSubmit } from "@src/shared/validation/helpers";

// models
import { FormContainerProps } from "./models";

// components
import Form, { FormFooter, FormHeader } from "@atlaskit/form";
import Button from "@atlaskit/button/new";
import ButtonGroup from "@atlaskit/button/button-group";
import FormProvider from "./FormProvider";

const FormContainer = <FormFields extends AnyObject>({
  onSubmit,
  onCancel,
  schema,
  title = "",
  titleContent = "",
  cancelText = "",
  submitText = "Save",
  cancelButtonAppearance = "subtle",
  submitButtonAppearance = "primary",
  footerAlign = "start",
  shouldDisableSubmitOnDirty = true,
  className = "",
  children,
}: FormContainerProps<FormFields>) => {
  return (
    <Form onSubmit={onFormSubmit<FormFields>(onSubmit, schema)}>
      {({ formProps, ...methods }) => (
        <FormProvider methods={methods}>
          <form {...formProps} noValidate className={className}>
            {Boolean(title) && <FormHeader title={title}>{titleContent}</FormHeader>}
            {children}
            <FormFooter align={footerAlign}>
              <ButtonGroup>
                {cancelText && (
                  <Button
                    testId="cancel-form-button"
                    appearance={cancelButtonAppearance}
                    onClick={onCancel}
                    isDisabled={methods.submitting}
                  >
                    {cancelText}
                  </Button>
                )}
                <Button
                  testId="submit-form-button"
                  type="submit"
                  appearance={submitButtonAppearance}
                  isDisabled={shouldDisableSubmitOnDirty ? !methods.dirty : false}
                  isLoading={methods.submitting}
                >
                  {submitText}
                </Button>
              </ButtonGroup>
            </FormFooter>
          </form>
        </FormProvider>
      )}
    </Form>
  );
};
export default FormContainer;
