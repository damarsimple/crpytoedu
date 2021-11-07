import moment from "moment";

export function getRange(
  startDate: Date,
  endDate: Date,
  type: "days" | "hours"
) {
  let fromDate = moment(startDate);
  let toDate = moment(endDate);
  let diff = toDate.diff(fromDate, type);
  let range = [];
  for (let i = 0; i < diff; i++) {
    range.push(moment(startDate).add(i, type));
  }
  return range;
}
