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
