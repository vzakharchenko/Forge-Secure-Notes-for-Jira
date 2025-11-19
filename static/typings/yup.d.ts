// libs
import * as yup from "yup";

declare module "yup" {
  interface StringSchema<TType, TContext, TDefault, TFlags>
    extends yup.Schema<TType, TContext, TDefault, TFlags> {
    sequence(schemas: StringSchema[]): this;
  }
}

export default yup;
