// libs
import filter from "lodash/filter";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import isNull from "lodash/isNull";
import isPlainObject from "lodash/isPlainObject";
import isString from "lodash/isString";
import map from "lodash/map";
import mapValues from "lodash/mapValues";
import pickBy from "lodash/pickBy";
import { AnyObject } from "yup";

// constants
import { REGEX_VALIDATION } from "@src/shared/validation/rules";

export const deepTrim = (object: AnyObject | string | Array<unknown>): unknown => {
  if (isString(object)) return trimString(object);
  if (isArray(object)) return sanitizeArray(object);
  if (isPlainObject(object)) return sanitizeObject(object);
  return object;
};

const trimString = (string: string): string => {
  return isEmpty(string)
    ? string
    : string
        .replace(REGEX_VALIDATION.NON_WHITESPACE_CHARACTERS_EXCLUDE_NEW_LINE, " ")
        .replace(REGEX_VALIDATION.NEW_LINE_CHARACTERS, "\n")
        .trim();
};

const sanitizeArray = (array: Array<unknown>) => {
  return filter(map(array, deepTrim), isProvided);
};

function sanitizeObject(object: AnyObject) {
  return pickBy(mapValues(object, deepTrim), isProvided);
}

const isProvided = (value: unknown) => {
  return !isNull(value) || !isString(value) || !isArray(value) || !isPlainObject(value);
};
