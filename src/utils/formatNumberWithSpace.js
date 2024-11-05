export function formatNumberWithSpace(number) {
  // Format angka untuk memastikan tidak ada trailing zero jika angka pecahan
  let numberStr = number.toString();
  let [integerPart, decimalPart] = numberStr.split(".");

  // Format integer part with thousand separators
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Combine integer part with decimal part if it exists
  if (decimalPart !== undefined) {
    // Remove trailing zeros only if decimal part is present
    decimalPart = decimalPart.replace(/0+$/, "");
    if (decimalPart.length > 0) {
      return integerPart + "." + decimalPart;
    }
  }

  return integerPart;
}
