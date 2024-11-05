import { getFileIdFromUrl } from "./getFileIdFromUrl";

export function getThumbnailUrlFromFileUrl(fileUrl) {
  // Gunakan regular expression untuk mengekstrak file ID
  const fileId = getFileIdFromUrl(fileUrl);

  if (fileId) {
    // Format thumbnail URL dengan file ID
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  } else {
    return null; // Tidak ditemukan ID
  }
}
