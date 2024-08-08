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
export function getThaiCurrentFormatNosign(amount: number): string {
  return Intl.NumberFormat("th-TH", {
    style: "decimal",
    currency: "THB",
    minimumFractionDigits: 2,
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

// http://muangyala.ddns.net/calculator/numtothai.php
// https://earthchie.github.io/BAHTTEXT.js/
interface IThaiPlaceValueName {
  [key: number]: string;
}

const thaiNumberName: IThaiPlaceValueName = {
  0: "หนึ่ง",
  1: "สอง",
  2: "สาม",
  3: "สี่",
  4: "ห้า",
  5: "หก",
  6: "เจ็ด",
  7: "แปด",
  8: "เก้า",
};

const thaiSSNumberName: IThaiPlaceValueName = {
  0: "เอ็ด",
  1: "ยี่",
};

function splitStringEverySixCharsRegex(amount: number): string {
  const parsedAmount = String(amount);
  const reversedString = parsedAmount.split("").reverse().join("");
  const matchedStrings = reversedString.match(/.{1,6}/g) || [];
  let result = "";

  matchedStrings.forEach((e, index) => {
    if (index > 0) {
      result = "ล้าน" + result;
    }

    // หลักหน่วย
    if (e[0]) {
      const unitDigit = parseInt(e[0]);
      if (unitDigit === 1) {
        result = (e[1] ? "เอ็ด" : "หนึ่ง") + result;
      } else if (unitDigit !== 0) {
        result = thaiNumberName[unitDigit - 1] + result;
      }
    }

    // หลักสิบ
    if (e[1]) {
      const tenDigit = parseInt(e[1]);
      if (tenDigit !== 0) {
        if (tenDigit === 1) {
          result = "สิบ" + result;
        } else if (tenDigit === 2) {
          result = thaiSSNumberName[1] + "สิบ" + result;
        } else {
          result = thaiNumberName[tenDigit - 1] + "สิบ" + result;
        }
      }
    }

    // หลักร้อย
    if (e[2]) {
      const hundredDigit = parseInt(e[2]);
      if (hundredDigit !== 0) {
        result = thaiNumberName[hundredDigit - 1] + "ร้อย" + result;
      }
    }

    // หลักพัน
    if (e[3]) {
      const thousandDigit = parseInt(e[3]);
      if (thousandDigit !== 0) {
        result = thaiNumberName[thousandDigit - 1] + "พัน" + result;
      }
    }

    // หลักหมื่น
    if (e[4]) {
      const tenThousandDigit = parseInt(e[4]);
      if (tenThousandDigit !== 0) {
        result = thaiNumberName[tenThousandDigit - 1] + "หมื่น" + result;
      }
    }

    // หลักแสน
    if (e[5]) {
      const hundredThousandDigit = parseInt(e[5]);
      if (hundredThousandDigit !== 0) {
        result = thaiNumberName[hundredThousandDigit - 1] + "แสน" + result;
      }
    }
  });

  return result;
}

export const getThaiCurrencyCall = (amount: number): string => {
  const fixedAmount = amount.toFixed(2);
  const integerPart = Math.floor(parseFloat(fixedAmount));
  const floatingValue = parseFloat(fixedAmount) - integerPart;

  let result = splitStringEverySixCharsRegex(integerPart) + "บาท";

  if (floatingValue === 0) {
    result += "ถ้วน";
  } else {
    const satang = Math.floor(parseFloat(floatingValue.toFixed(2)) * 100);
    result += splitStringEverySixCharsRegex(satang) + "สตางค์";
  }

  return result;
};
