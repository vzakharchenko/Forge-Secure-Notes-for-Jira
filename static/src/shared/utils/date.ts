// libs
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { endOfDay, startOfDay } from "date-fns";

// constants
import { DATE_FORMATS } from "@src/shared/constants/formates";

export const dateNow = () => new Date();

export const dateMin = () => new Date(0);

export const formatDateWithTimezoneAndFormat = (
  date: string | Date,
  timezone: string,
  format = DATE_FORMATS.DATE_TIME,
) => formatInTimeZone(date, timezone, format);

export const getStartOfDayFromZonedDate = (date: string, timezone: string) => {
  return fromZonedTime(startOfDay(date), timezone).toISOString();
};

export const getEndOfDayFromZonedDate = (date: string, timezone: string) => {
  return fromZonedTime(endOfDay(date), timezone).toISOString();
};
