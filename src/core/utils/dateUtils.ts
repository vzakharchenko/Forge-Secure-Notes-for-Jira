// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

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
