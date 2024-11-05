export const getMonthFromDateString = (dateString) => {
  // Memisahkan string berdasarkan tanda "-"
  const [day, month, year] = dateString.split("-").map(Number);

  // Mengembalikan bulan (1-12) dari string tanggal sebagai string
  return month.toString(); // Mengonversi bulan ke string
};
