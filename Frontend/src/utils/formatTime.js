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

export const formatTimeToIST = (inputDateStr) => {
  // Create a Date object from the UTC date-time string
  const date = new Date(inputDateStr);

  // Define options for date and time formatting
  // const options = {
  //   timeZone: "Asia/Kolkata", // IST timezone
  //   year: "numeric",
  //   month: "2-digit",
  //   day: "2-digit",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  // };

  // Convert the date to IST and format it
  return date.toLocaleString("en-IN");
};
