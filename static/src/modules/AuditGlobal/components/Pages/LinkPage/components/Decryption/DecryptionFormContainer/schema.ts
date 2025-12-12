// libs
import { object, string } from "yup";

// constants
import { VALIDATION_MESSAGES } from "@src/shared/validation/messages";

const FORM_FIELDS = {
  DECRYPTION_KEY: "Decryption key",
};

export const schema = object().shape({
  decryptionKey: string()
    .trim()
    .default("")
    .sequence([
      string().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.DECRYPTION_KEY)),
      string().min(3, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.DECRYPTION_KEY, 3)),
      string().max(255, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.DECRYPTION_KEY, 255)),
    ]),
});
