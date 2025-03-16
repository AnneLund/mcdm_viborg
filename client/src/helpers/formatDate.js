export const formatDate = (dateString, locale = "da-DK") => {
  if (!dateString) return "Ugyldig dato";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Ugyldig dato";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const formatDateWithDay = (dateString, locale = "da-DK") => {
  if (!dateString) return "Ugyldig dato";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Ugyldig dato";

  const formattedDate = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};
