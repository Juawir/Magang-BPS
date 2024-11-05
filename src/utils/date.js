export function excelDateToDateString(excelDate) {
  // Excel date system starts from 1 January 1900
  const excelBaseDate = new Date(1900, 0, 1);

  // Excel erroneously considers 1900 as a leap year, so adjust by subtracting 1 day
  // Excel counts days from 1 Jan 1900, so we need to adjust by subtracting 1 day from the start date
  const daysOffset = excelDate - 1; // We subtract 1 to account for Excel's leap year bug and starting from 1 Jan 1900

  // Create the target date by adding daysOffset to the base date
  const targetDate = new Date(
    excelBaseDate.getTime() + daysOffset * 24 * 60 * 60 * 1000
  );

  // Extract day, month, and year
  const day = String(targetDate.getDate()).padStart(2, "0");
  const month = String(targetDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = targetDate.getFullYear();

  // Return the formatted date string
  return `${day}-${month}-${year}`;
}

export function convertDatesInArray(dataArray) {
  return dataArray.map((item) => {
    // Convert the `tanggal_lahir` field if it exists and is a number
    if (typeof item.tanggal_lahir === "number") {
      item.tanggal_lahir = excelDateToDateString(item.tanggal_lahir);
    }
    return item;
  });
}
