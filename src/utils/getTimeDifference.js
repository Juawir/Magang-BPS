export const getTimeDifference = (lastUpdated) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(lastUpdated)) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} detik`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} menit`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} jam`;
  } else if (diffInSeconds < 2592000) {
    return `${Math.floor(diffInSeconds / 86400)} hari`;
  } else if (diffInSeconds < 31536000) {
    return `${Math.floor(diffInSeconds / 2592000)} bulan`;
  } else {
    return `${Math.floor(diffInSeconds / 31536000)} tahun`;
  }
};
