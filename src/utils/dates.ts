const CINEMA_OPEN_HOUR = 9;
const CINEMA_CLOSE_HOUR = 20;
const SCREENING_BUFFER_MINUTES = 30;

const toMinutesSinceMidnight = (date: Date): number => {
  return date.getHours() * 60 + date.getMinutes();
};

export const isSameCalendarDay = (start: Date, end: Date): boolean => {
  return (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  );
};

export const getDurationInMinutes = (start: Date, end: Date): number => {
  const milliseconds = end.getTime() - start.getTime();
  return Math.floor(milliseconds / (1000 * 60));
};

export const isWithinCinemaOpeningHours = (start: Date): boolean => {
  const openingMinutes = CINEMA_OPEN_HOUR * 60;
  const closingMinutes = CINEMA_CLOSE_HOUR * 60;
  const startMinutes = toMinutesSinceMidnight(start);

  return startMinutes >= openingMinutes && startMinutes <= closingMinutes;
};

export const hasMinimumScreeningDuration = (
  start: Date,
  end: Date,
  movieDurationMinutes: number,
  extraMinutes: number = SCREENING_BUFFER_MINUTES
): boolean => {
  const duration = getDurationInMinutes(start, end);
  return duration >= movieDurationMinutes + extraMinutes;
};
