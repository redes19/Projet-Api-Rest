const CINEMA_OPEN_HOUR = 9;
const CINEMA_CLOSE_HOUR = 20;
const SCREENING_BUFFER_MINUTES = 30;

function toMinutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function isSameCalendarDay(start: Date, end: Date): boolean {
  return (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  );
}

export function getDurationInMinutes(start: Date, end: Date): number {
  const milliseconds = end.getTime() - start.getTime();
  return Math.floor(milliseconds / (1000 * 60));
}

/**
 * Vérifie que la séance se déroule entièrement dans le créneau d'ouverture du cinéma (9h-20h).
 * - start doit être ≥ 09h00
 * - end doit être ≤ 20h00
 * - start et end doivent être le même jour
 */
export function isWithinCinemaOpeningHours(start: Date, end: Date): boolean {
  const startMinutes = toMinutesSinceMidnight(start);
  const endMinutes = toMinutesSinceMidnight(end);
  const openMinutes = CINEMA_OPEN_HOUR * 60;
  const closeMinutes = CINEMA_CLOSE_HOUR * 60;

  if (!isSameCalendarDay(start, end)) return false;
  if (startMinutes < openMinutes) return false;
  if (endMinutes > closeMinutes) return false;
  return true;
}

/**
 * Le cinéma est ouvert du lundi au vendredi (cf. sujet : "ouvert du lundi au vendredi de 9h à 20h").
 * getDay() : 0 = dimanche, 6 = samedi
 */
export function isCinemaOpenOnDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export function hasMinimumScreeningDuration(
  start: Date,
  end: Date,
  movieDurationMinutes: number,
  extraMinutes: number = SCREENING_BUFFER_MINUTES
): boolean {
  const duration = getDurationInMinutes(start, end);
  return duration >= movieDurationMinutes + extraMinutes;
}
