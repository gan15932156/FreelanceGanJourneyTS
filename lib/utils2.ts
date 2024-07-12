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
