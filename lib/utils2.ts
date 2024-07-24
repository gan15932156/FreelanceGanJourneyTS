import { parseISO, format, FormatOptions } from "date-fns";
import { th } from "date-fns/locale";
import _ from "lodash";
type AnyObject = Record<string, any>;
export function formatPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.length !== 10) {
    return "";
  }

  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6)}`;
}
export function formatTaxId(input: string): string {
  if (input.length !== 13) {
    return "";
  }

  return `${input.slice(0, 1)}-${input.slice(1, 5)}-${input.slice(
    5,
    10
  )}-${input.slice(10, 12)}-${input.slice(12)}`;
}

export const formatDate = (date: Date): string => {
  const formatter = new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return formatter.format(date).replace(/\//g, " ");
};

export function getThaiCurrentFormat(amount: number): string {
  return Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount);
}

export const formatThaiDate = (isoDate: string): string => {
  const date = parseISO(isoDate);
  // Adjust the year to the Buddhist calendar
  const buddhistYear = date.getFullYear() + 543;
  const formattedDate = format(date, `dd MMMM ${buddhistYear}`, { locale: th });
  return formattedDate;
};
const findDifferences = <T extends AnyObject>(obj1: T, obj2: T): Partial<T> => {
  return _.transform(
    obj1,
    (result, value, key) => {
      if (!_.isEqual(value, obj2[key])) {
        (result as AnyObject)[key] = obj2[key];
      }
    },
    {} as Partial<T>
  );
};

export const updateDataIfDifferent = <T extends AnyObject>(
  original: T,
  updated: T
): T => {
  const differences = findDifferences(original, updated);
  if (!_.isEmpty(differences)) {
    return { ...original, ...differences };
  }
  return original;
};

export const getAddDays = (date: Date, days: number): Date => {
  const newDate = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  return newDate;
};

export const formatBuddhistDate = (
  date: Date,
  formatStr: string,
  options?: FormatOptions
): string => {
  const buddhistYear = date.getFullYear() + 543;
  const formattedDate = format(date, formatStr, options);
  return formattedDate.replace(
    date.getFullYear().toString(),
    buddhistYear.toString()
  );
};
