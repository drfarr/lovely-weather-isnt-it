import dayjs from "dayjs";
import { Unit } from "./WeatherAPI.class";
var isTomorrow = require("dayjs/plugin/isTomorrow");

dayjs.extend(isTomorrow);

/**
 * Format a datetime string into a nice readable format.
 * i.e Fri, 25 May
 * @param value
 * @param format
 * @returns string
 */
export const formatDate = (value: string) => {
  const date = dayjs(value);

  //@ts-ignore
  if (date.isTomorrow()) {
    return "Tomorrow";
  }
  return date.format("ddd DD, MMM");
};

/**
 * Format a datetime string into a nice readable format.
 * 04:26
 * @param value
 * @param format
 * @returns string
 */
export const formatHours = (value: string) => {
  return dayjs(value).format("HH:MM");
};

/**
 * Add the symbol suffix for a tempreature number.
 * @param value
 * @param format
 * @returns string
 */
export const formatTempreature = (value: number, format: Unit) => {
  return `${Math.floor(value)}°${format === Unit.imperial ? "F" : "C"}`;
};
