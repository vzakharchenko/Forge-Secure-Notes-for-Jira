import { DateTime } from "luxon";

export const formatDateTime = (date: Date) => {
  return DateTime.fromJSDate(date).toFormat("MMMM dd, yyyy hh:mm a");
};
export const formatDate = (date: Date) => {
  return DateTime.fromJSDate(date).toFormat("MMMM dd, yyyy");
};

export const defaultDateForDatePicker = (date: Date) => {
  return DateTime.fromJSDate(date).toFormat("MMMM dd, yyyy");
};
