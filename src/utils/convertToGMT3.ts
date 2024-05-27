export const convertToGMT3 = (date: Date) => {
  const offsetDate = new Date(date);
  offsetDate.setHours(offsetDate.getHours() - 3);
  return offsetDate;
};
