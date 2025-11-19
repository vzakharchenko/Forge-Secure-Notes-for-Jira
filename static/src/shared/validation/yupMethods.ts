// libs
import { addMethod, string, StringSchema, ValidationError } from "yup";

addMethod(string, "sequence", function (schemas: StringSchema[]) {
  return string().test(async (value, context) => {
    try {
      for (const schema of schemas) {
        await schema.validate(value);
      }
    } catch (error: unknown) {
      const message = (error as ValidationError).message;
      return context.createError({ message });
    }

    return true;
  });
});
