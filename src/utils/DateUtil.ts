export const dateDiffFromToday = (date: Date) => {
  const today = new Date();

  return today.getDate() - date.getDate();
};

export const isSameDateMY = (date: Date) => {
  const today = new Date();

  return (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  );
};

export const isSameMonthY = (date: Date) => {
  const today = new Date();

  return (
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  );
};

export const isSameYear = (date: Date) => {
  const today = new Date();

  return today.getFullYear() === date.getFullYear();
};
