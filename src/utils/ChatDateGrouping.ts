import {
  dateDiffFromToday,
  isSameDateMY,
  isSameMonthY,
  isSameYear,
} from "./DateUtil";

import { TODAY, YESTERDAY, PREV7DAYS, PREV30DAYS } from "./Utils";

export const GroupKey = (chatDate: Date) => {
  const MONTH = chatDate.toLocaleString("default", { month: "long" });
  const YEAR = chatDate.getFullYear();

  if (isSameDateMY(chatDate)) {
    return TODAY;
  } else if (isSameMonthY(chatDate)) {
    const dateDiff = dateDiffFromToday(chatDate);
    if (dateDiff == 1) {
      return YESTERDAY;
    } else if (dateDiff > 1 && dateDiff <= 7) {
      return PREV7DAYS;
    } else if (dateDiff > 7 && dateDiff <= 30) {
      return PREV30DAYS;
    }
  } else if (isSameYear(chatDate)) {
    return MONTH;
  } else {
    return YEAR;
  }
};
