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
