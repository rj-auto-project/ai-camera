export const formatDateTime = (inputDateStr) => {
  const dateObj = new Date(inputDateStr);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  const seconds = "00";
  const timezoneOffset = "+05:30";
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}${timezoneOffset}`;
};
