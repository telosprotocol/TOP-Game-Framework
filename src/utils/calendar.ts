// export const DAYNAME = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYNAME_MAP = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  id: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
};
const MONTHNAMEMAP = {
  en: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  id: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ],
};

function getVueIns() {
  return window.vue205;
}
function getLang(lang?: string) {
  if (lang) {
    return lang as 'en' | 'id';
  }
  return (getVueIns()?.$i18n?.locale || 'en') as 'en' | 'id';
}

export function getDayNameList(lang?: string) {
  return DAYNAME_MAP[getLang(lang)] || DAYNAME_MAP.en;
}

export function getMonthNameList(lang?: string) {
  return MONTHNAMEMAP[getLang(lang)] || MONTHNAMEMAP.en;
}
export function getMonthName(dtOrTs: Date | number) {
  const dt = typeof dtOrTs === 'number' ? new Date(dtOrTs) : dtOrTs;
  return getMonthNameList()[dt.getMonth()];
}

export function getDayName(dt: Date) {
  return getDayNameList()[dt.getDay()];
}

/**
 *  dt           0
 * @param dt
 * @returns
 */
export function normalizeDate(dt: Date, isUtc?: boolean) {
  if (isUtc) {
    dt.setUTCHours(0, 0, 0, 0);
  } else {
    dt.setHours(0, 0, 0, 0);
  }
  return dt;
}

export function getMonthFirstDate(dt: Date, isUtc?: boolean) {
  const firstDay = new Date(dt.getTime());
  normalizeDate(firstDay, isUtc);
  firstDay.setDate(1);
  return firstDay;
}
export type DayItem = {
  /**
   *      dt.getMonth()+1
   */
  month: number;
  /**
   *
   */
  date: number;
  isCur?: true;
  timestamp: number;
};
/**
 *   dt         （       ）
 * @param dt
 */
export function getCalendarMonth(dt: Date) {
  // const date = dt.getDate();
  // const day = dt.getDay(); //   0,  ...
  const firstDay = getMonthFirstDate(dt);
  const firstDayDay = firstDay.getDay();

  const rowList: DayItem[][] = [[]];
  let curRow = rowList[0];
  if (firstDayDay !== 0) {
    const dtTmp1 = new Date(firstDay.getTime());
    dtTmp1.setDate(0); //
    const lastMonthlastDate = dtTmp1.getDate();
    const lastMonth = dtTmp1.getMonth() + 1;
    for (
      let date = lastMonthlastDate - firstDayDay + 1;
      date <= lastMonthlastDate;
      date++
    ) {
      dtTmp1.setDate(date);
      curRow.push({
        month: lastMonth,
        date: date,
        timestamp: dtTmp1.getTime(),
      });
    }
  }
  const curMonthList = [];
  const dtTmp = new Date(firstDay.getTime());
  const curMonthIdx = dt.getMonth(); // month+1
  for (let date = 1; date <= 31; date++) {
    dtTmp.setDate(date);
    if (dtTmp.getMonth() === curMonthIdx) {
      curMonthList.push(dtTmp.getTime()); //
      if (curRow.length === 7) {
        curRow = [];
        rowList.push(curRow);
      }
      curRow.push({
        timestamp: dtTmp.getTime(),
        month: curMonthIdx + 1,
        date: date,
        isCur: true,
      });
    } else {
      break;
    }
  }

  if (curRow.length < 7) {
    const dtTmp1 = new Date(firstDay.getTime());
    dtTmp1.setMonth(firstDay.getMonth() + 1); //
    const nextMonth = dtTmp1.getMonth() + 1;
    for (let i = curRow.length; i < 7; i++) {
      const curDate = dtTmp1.getDate();
      curRow.push({
        timestamp: dtTmp1.getTime(),
        month: nextMonth,
        date: curDate,
      });
      dtTmp1.setDate(curDate + 1);
    }
  }
  return rowList;
}
