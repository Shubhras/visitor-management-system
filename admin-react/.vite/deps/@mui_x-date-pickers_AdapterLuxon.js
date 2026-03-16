import {
  DateTime,
  Info
} from "./chunk-5FGFN5PT.js";
import {
  _extends
} from "./chunk-HQ6ZTAWL.js";
import "./chunk-G3PMV62Z.js";

// node_modules/@mui/x-date-pickers/esm/AdapterLuxon/AdapterLuxon.js
var formatTokenMap = {
  // Year
  y: {
    sectionType: "year",
    contentType: "digit",
    maxLength: 4
  },
  yy: "year",
  yyyy: {
    sectionType: "year",
    contentType: "digit",
    maxLength: 4
  },
  // Month
  L: {
    sectionType: "month",
    contentType: "digit",
    maxLength: 2
  },
  LL: "month",
  LLL: {
    sectionType: "month",
    contentType: "letter"
  },
  LLLL: {
    sectionType: "month",
    contentType: "letter"
  },
  M: {
    sectionType: "month",
    contentType: "digit",
    maxLength: 2
  },
  MM: "month",
  MMM: {
    sectionType: "month",
    contentType: "letter"
  },
  MMMM: {
    sectionType: "month",
    contentType: "letter"
  },
  // Day of the month
  d: {
    sectionType: "day",
    contentType: "digit",
    maxLength: 2
  },
  dd: "day",
  // Day of the week
  c: {
    sectionType: "weekDay",
    contentType: "digit",
    maxLength: 1
  },
  ccc: {
    sectionType: "weekDay",
    contentType: "letter"
  },
  cccc: {
    sectionType: "weekDay",
    contentType: "letter"
  },
  E: {
    sectionType: "weekDay",
    contentType: "digit",
    maxLength: 2
  },
  EEE: {
    sectionType: "weekDay",
    contentType: "letter"
  },
  EEEE: {
    sectionType: "weekDay",
    contentType: "letter"
  },
  // Meridiem
  a: "meridiem",
  // Hours
  H: {
    sectionType: "hours",
    contentType: "digit",
    maxLength: 2
  },
  HH: "hours",
  h: {
    sectionType: "hours",
    contentType: "digit",
    maxLength: 2
  },
  hh: "hours",
  // Minutes
  m: {
    sectionType: "minutes",
    contentType: "digit",
    maxLength: 2
  },
  mm: "minutes",
  // Seconds
  s: {
    sectionType: "seconds",
    contentType: "digit",
    maxLength: 2
  },
  ss: "seconds"
};
var defaultFormats = {
  year: "yyyy",
  month: "LLLL",
  monthShort: "MMM",
  dayOfMonth: "d",
  // Full day of the month format (i.e. 3rd) is not supported
  // Falling back to regular format
  dayOfMonthFull: "d",
  weekday: "cccc",
  weekdayShort: "ccccc",
  hours24h: "HH",
  hours12h: "hh",
  meridiem: "a",
  minutes: "mm",
  seconds: "ss",
  fullDate: "DD",
  keyboardDate: "D",
  shortDate: "MMM d",
  normalDate: "d MMMM",
  normalDateWithWeekday: "EEE, MMM d",
  fullTime12h: "hh:mm a",
  fullTime24h: "HH:mm",
  keyboardDateTime12h: "D hh:mm a",
  keyboardDateTime24h: "D T"
};
var AdapterLuxon = class {
  isMUIAdapter = true;
  isTimezoneCompatible = true;
  lib = "luxon";
  escapedCharacters = {
    start: "'",
    end: "'"
  };
  formatTokenMap = /* @__PURE__ */ (() => formatTokenMap)();
  constructor({
    locale,
    formats
  } = {}) {
    this.locale = locale || "en-US";
    this.formats = _extends({}, defaultFormats, formats);
  }
  setLocaleToValue = (value) => {
    const expectedLocale = this.getCurrentLocaleCode();
    if (expectedLocale === value.locale) {
      return value;
    }
    return value.setLocale(expectedLocale);
  };
  date = (value, timezone = "default") => {
    if (value === null) {
      return null;
    }
    if (typeof value === "undefined") {
      return DateTime.fromJSDate(/* @__PURE__ */ new Date(), {
        locale: this.locale,
        zone: timezone
      });
    }
    return DateTime.fromISO(value, {
      locale: this.locale,
      zone: timezone
    });
  };
  getInvalidDate = () => DateTime.fromJSDate(/* @__PURE__ */ new Date("Invalid Date"));
  getTimezone = (value) => {
    if (value.zone.type === "system") {
      return "system";
    }
    return value.zoneName;
  };
  setTimezone = (value, timezone) => {
    if (!value.zone.equals(Info.normalizeZone(timezone))) {
      return value.setZone(timezone);
    }
    return value;
  };
  toJsDate = (value) => {
    return value.toJSDate();
  };
  parse = (value, formatString) => {
    if (value === "") {
      return null;
    }
    return DateTime.fromFormat(value, formatString, {
      locale: this.locale
    });
  };
  getCurrentLocaleCode = () => {
    return this.locale;
  };
  /* v8 ignore start */
  is12HourCycleInCurrentLocale = () => {
    if (typeof Intl === "undefined" || typeof Intl.DateTimeFormat === "undefined") {
      return true;
    }
    return Boolean(new Intl.DateTimeFormat(this.locale, {
      hour: "numeric"
    })?.resolvedOptions()?.hour12);
  };
  /* v8 ignore stop */
  expandFormat = (format) => {
    const catchEscapedSectionsRegexp = /''|'(''|[^'])+('|$)|[^']*/g;
    const validTokens = [...Object.keys(this.formatTokenMap), "yyyyy"];
    const isWordComposedOfTokens = new RegExp(`^(${validTokens.join("|")})+$`);
    const catchWordsRegexp = /(?:^|[^a-z])([a-z]+)(?:[^a-z]|$)|([a-z]+)/gi;
    return format.match(catchEscapedSectionsRegexp).map((token) => {
      const firstCharacter = token[0];
      if (firstCharacter === "'") {
        return token;
      }
      const expandedToken = DateTime.expandFormat(token, {
        locale: this.locale
      });
      return expandedToken.replace(catchWordsRegexp, (substring, g1, g2) => {
        const word = g1 || g2;
        if (isWordComposedOfTokens.test(word)) {
          return substring;
        }
        return `'${substring}'`;
      });
    }).join("").replace("yyyyy", "yyyy");
  };
  isValid = (value) => {
    if (value === null) {
      return false;
    }
    return value.isValid;
  };
  format = (value, formatKey) => {
    return this.formatByString(value, this.formats[formatKey]);
  };
  formatByString = (value, format) => {
    return value.setLocale(this.locale).toFormat(format);
  };
  formatNumber = (numberToFormat) => {
    return numberToFormat;
  };
  isEqual = (value, comparing) => {
    if (value === null && comparing === null) {
      return true;
    }
    if (value === null || comparing === null) {
      return false;
    }
    return +value === +comparing;
  };
  isSameYear = (value, comparing) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    return value.hasSame(comparingInValueTimezone, "year");
  };
  isSameMonth = (value, comparing) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    return value.hasSame(comparingInValueTimezone, "month");
  };
  isSameDay = (value, comparing) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    return value.hasSame(comparingInValueTimezone, "day");
  };
  isSameHour = (value, comparing) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    return value.hasSame(comparingInValueTimezone, "hour");
  };
  isAfter = (value, comparing) => {
    return value > comparing;
  };
  isAfterYear = (value, comparing) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    const diff = value.diff(this.endOfYear(comparingInValueTimezone), "years").toObject();
    return diff.years > 0;
  };
  isAfterDay = (value, comparing) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    const diff = value.diff(this.endOfDay(comparingInValueTimezone), "days").toObject();
    return diff.days > 0;
  };
  isBefore = (value, comparing) => {
    return value < comparing;
  };
  isBeforeYear = (value, comparing) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    const diff = value.diff(this.startOfYear(comparingInValueTimezone), "years").toObject();
    return diff.years < 0;
  };
  isBeforeDay = (value, comparing) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    const diff = value.diff(this.startOfDay(comparingInValueTimezone), "days").toObject();
    return diff.days < 0;
  };
  isWithinRange = (value, [start, end]) => {
    return this.isEqual(value, start) || this.isEqual(value, end) || this.isAfter(value, start) && this.isBefore(value, end);
  };
  startOfYear = (value) => {
    return value.startOf("year");
  };
  startOfMonth = (value) => {
    return value.startOf("month");
  };
  startOfWeek = (value) => {
    return this.setLocaleToValue(value).startOf("week", {
      useLocaleWeeks: true
    });
  };
  startOfDay = (value) => {
    return value.startOf("day");
  };
  endOfYear = (value) => {
    return value.endOf("year");
  };
  endOfMonth = (value) => {
    return value.endOf("month");
  };
  endOfWeek = (value) => {
    return this.setLocaleToValue(value).endOf("week", {
      useLocaleWeeks: true
    });
  };
  endOfDay = (value) => {
    return value.endOf("day");
  };
  addYears = (value, amount) => {
    return value.plus({
      years: amount
    });
  };
  addMonths = (value, amount) => {
    return value.plus({
      months: amount
    });
  };
  addWeeks = (value, amount) => {
    return value.plus({
      weeks: amount
    });
  };
  addDays = (value, amount) => {
    return value.plus({
      days: amount
    });
  };
  addHours = (value, amount) => {
    return value.plus({
      hours: amount
    });
  };
  addMinutes = (value, amount) => {
    return value.plus({
      minutes: amount
    });
  };
  addSeconds = (value, amount) => {
    return value.plus({
      seconds: amount
    });
  };
  getYear = (value) => {
    return value.get("year");
  };
  getMonth = (value) => {
    return value.get("month") - 1;
  };
  getDate = (value) => {
    return value.get("day");
  };
  getHours = (value) => {
    return value.get("hour");
  };
  getMinutes = (value) => {
    return value.get("minute");
  };
  getSeconds = (value) => {
    return value.get("second");
  };
  getMilliseconds = (value) => {
    return value.get("millisecond");
  };
  setYear = (value, year) => {
    return value.set({
      year
    });
  };
  setMonth = (value, month) => {
    return value.set({
      month: month + 1
    });
  };
  setDate = (value, date) => {
    return value.set({
      day: date
    });
  };
  setHours = (value, hours) => {
    return value.set({
      hour: hours
    });
  };
  setMinutes = (value, minutes) => {
    return value.set({
      minute: minutes
    });
  };
  setSeconds = (value, seconds) => {
    return value.set({
      second: seconds
    });
  };
  setMilliseconds = (value, milliseconds) => {
    return value.set({
      millisecond: milliseconds
    });
  };
  getDaysInMonth = (value) => {
    return value.daysInMonth;
  };
  getWeekArray = (value) => {
    const firstDay = this.startOfWeek(this.startOfMonth(value));
    const lastDay = this.endOfWeek(this.endOfMonth(value));
    const {
      days
    } = lastDay.diff(firstDay, "days").toObject();
    const weeks = [];
    new Array(Math.round(days)).fill(0).map((_, i) => i).map((day) => firstDay.plus({
      days: day
    })).forEach((v, i) => {
      if (i === 0 || i % 7 === 0 && i > 6) {
        weeks.push([v]);
        return;
      }
      weeks[weeks.length - 1].push(v);
    });
    return weeks;
  };
  getWeekNumber = (value) => {
    return value.localWeekNumber ?? value.weekNumber;
  };
  getDayOfWeek = (value) => {
    return value.localWeekday ?? value.weekday;
  };
  getYearRange = ([start, end]) => {
    const startDate = this.startOfYear(start);
    const endDate = this.endOfYear(end);
    const years = [];
    let current = startDate;
    while (this.isBefore(current, endDate)) {
      years.push(current);
      current = this.addYears(current, 1);
    }
    return years;
  };
};
export {
  AdapterLuxon
};
//# sourceMappingURL=@mui_x-date-pickers_AdapterLuxon.js.map
