// libs
import { array, object, string } from "yup";

// constants
import { VALIDATION_MESSAGES } from "@src/shared/validation/messages";
import { EXPIRY_OPTIONS } from "./constants";

const FORM_FIELDS = {
  USERS: "Users",
  DESCRIPTION: "Description",
  NOTE: "Note",
  EXPIRY_OPTION: "Expiry option",
  EXPIRY_DATE: "Expiry date",
  ENCRYPTION_KEY: "Encryption key",
};

export const schema = object().shape({
  targetUsers: array()
    .defined()
    .test((value, ctx) => {
      if (!value.length) {
        return ctx.createError({
          message: VALIDATION_MESSAGES.SELECT_MORE_THAN(FORM_FIELDS.USERS, 1),
        });
      }
      return true;
    }),
  description: string()
    .trim()
    .default("")
    .sequence([
      string().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.DESCRIPTION)),
      string().min(3, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.DESCRIPTION, 3)),
      string().max(255, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.DESCRIPTION, 255)),
    ]),
  note: string().trim().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.NOTE)),
  expiryOption: string()
    .oneOf(EXPIRY_OPTIONS.map(({ value }) => value))
    .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.EXPIRY_OPTION)),
  expiryDate: string()
    .default("")
    .test((value, ctx) => {
      if (!value && ctx.parent.expiryOption === "custom") {
        return ctx.createError({
          message: VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.EXPIRY_DATE),
        });
      }
      return true;
    }),
  encryptionKey: string().defined(),
});
