// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import moment from "moment";

export const formatDateTime = (date: Date) => {
  return moment(date).format("MMMM DD, YYYY hh:mm A");
};
export const formatDate = (date: Date) => {
  return moment(date).format("MMMM DD, YYYY");
};

export const defaultDateForDatePicker = (date: Date) => {
  return moment(date).format("YYYY-MM-DD");
};
