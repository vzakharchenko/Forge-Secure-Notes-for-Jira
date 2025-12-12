// libs
import React, { createContext, ReactElement, useContext } from "react";
import { AnyObject } from "yup";
import { FormState } from "final-form";

interface FormMethods<FormFields extends AnyObject> {
  disabled: boolean;
  dirty: boolean;
  submitting: boolean;
  getState: () => FormState<FormFields>;
  setFieldValue: (name: string, value: unknown) => void;
  reset: (initialValues?: FormFields) => void;
}

const FormContext = createContext<FormMethods<AnyObject> | null>(null);

export const useFormContext = <FormFields extends AnyObject>() => {
  const context = useContext(FormContext) as FormMethods<FormFields> | null;

  if (!context) {
    throw new Error("No context provided");
  }

  return context;
};

const FormProvider = <FormFields extends AnyObject>({
  children,
  methods,
}: {
  children: ReactElement;
  methods: FormMethods<FormFields>;
}) => {
  return (
    <FormContext.Provider value={methods as unknown as FormMethods<AnyObject>}>
      {children}
    </FormContext.Provider>
  );
};

export default FormProvider;
