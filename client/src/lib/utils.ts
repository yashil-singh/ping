import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateDistanceNoSuffix = (
  date: Date | string | number,
): string => {
  const now = new Date();
  const givenDate = new Date(date);

  const seconds = differenceInSeconds(now, givenDate);
  const minutes = differenceInMinutes(now, givenDate);
  const hours = differenceInHours(now, givenDate);
  const days = differenceInDays(now, givenDate);
  const weeks = differenceInWeeks(now, givenDate);
  const months = differenceInMonths(now, givenDate);
  const years = differenceInYears(now, givenDate);

  if (seconds < 60) return `${seconds}s`;
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  if (weeks < 5) return `${weeks}w`;
  if (months < 12) return `${months}mo`;

  return `${years}y`;
};
