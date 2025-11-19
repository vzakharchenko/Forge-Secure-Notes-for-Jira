export const VALIDATION_MESSAGES = {
  MIN_LENGTH: (min: number) => `The minimum allowed value is ${min}`,
  MAX_LENGTH: (max: number) => `The maximum allowed value is ${max}`,
  MIN_LENGTH_SYMBOLS: (fieldName: string, minLength: number) =>
    `${fieldName} should be equal or greater than ${minLength} symbols`,
  MAX_LENGTH_SYMBOLS: (fieldName: string, maxLength: number) =>
    `${fieldName} should be equal or less than ${maxLength} symbols`,
  SELECT_MORE_THAN: (fieldName: string, min: number) =>
    `${fieldName} should include a minimum of ${min} items`,
  SELECT_LESS_THAN: (fieldName: string, max: number) =>
    `${fieldName} should include a maximum of ${max} items`,
  REQUIRED: (fieldName: string) => `${fieldName} is required`,
  ENTER_VALID: (fieldName: string) => `Please, enter a valid ${fieldName.toLowerCase()}`,
  SUPPORTED_FILE_FORMATS: (supportedFormats: string[]) =>
    `Supported file formats are: ${supportedFormats.join(", ")}`,
  DATE_RANGE_VALID: "'Before' field cannot be later than 'After' field",
  MIN_DATE: (minDate: string) => `The minimum allowed date is ${minDate}`,
  MAX_DATE: (minDate: string) => `The maximum allowed date is ${minDate}`,
};
