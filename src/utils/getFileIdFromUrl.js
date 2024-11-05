export function getFileIdFromUrl(url) {
  // Gunakan regular expression untuk mengekstrak file ID
  const regex = /\/d\/([^\/]+)/;
  const matches = url.match(regex);

  if (matches && matches[1]) {
    return matches[1]; // File ID
  } else {
    return null; // Tidak ditemukan ID
  }
}