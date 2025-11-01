import { DateTime } from "luxon";

export const formatDateTime = (date: Date) => {
    return DateTime.fromJSDate(date).toFormat("MMMM DD, YYYY hh:mm A");
};
export const formatDate = (date: Date) => {
    return DateTime.fromJSDate(date).toFormat("MMMM DD, YYYY");
};

export const defaultDateForDatePicker = (date: Date) => {
    return DateTime.fromJSDate(date).toFormat("MMMM DD, YYYY");
};
