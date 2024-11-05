export const getYearFromDateString = (dateString) => {
  // Memisahkan string berdasarkan tanda "-"
  const [day, month, year] = dateString.split("-").map(Number);

  // Membuat objek Date dengan format tahun, bulan, hari
  const date = new Date(year, month - 1, day); // Bulan dikurangi 1 karena indeks bulan dimulai dari 0

  // Mengembalikan tahun dari objek Date
  return date.getFullYear().toString();
};
