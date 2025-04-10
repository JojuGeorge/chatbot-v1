export const isSameDate = (date1Iso: string, date2Iso: string) => {
  const date1 = new Date(date1Iso);
  const date2 = new Date(date2Iso);

  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};
