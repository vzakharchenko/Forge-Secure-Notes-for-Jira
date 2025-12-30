import { validate } from "class-validator";

export const getValidationErrors = async <T extends object>(
  req: { payload: unknown },
  validateClass: new () => T,
): Promise<Record<string, string[]>> => {
  if (!req?.payload) {
    throw Error("empty request");
  }
  const response: Record<string, string[]> = {};
  const entity = Object.assign(new validateClass(), req.payload);
  const validationErrors = await validate(entity, { stopAtFirstError: true });
  if (validationErrors && validationErrors.length > 0) {
    validationErrors.forEach((error) => {
      const values = response[error.property];
      if (!values) {
        response[error.property] = [Object.values(error.constraints!)[0]];
      } else {
        values.push(error.toString(false, true, undefined, true));
      }
    });
  }
  return response;
};
