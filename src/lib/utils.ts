import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, resolving Tailwind CSS conflicts.
 * @param inputs - An array of class values (strings, objects, arrays).
 * @returns A string of combined and merged class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date object or string into a more readable format.
 * Example: "January 1, 2023"
 * @param dateInput - The date to format.
 * @param options - Optional Intl.DateTimeFormatOptions.
 * @returns A formatted date string.
 */
export function formatDate(
  dateInput: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(dateInput);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options, // User options override defaults
  };
  return date.toLocaleDateString(undefined, defaultOptions); // Uses browser's default locale
}

/**
 * Generates a simple slug from a string.
 * Converts to lowercase, replaces spaces with hyphens, and removes non-alphanumeric characters (except hyphens).
 * @param text - The string to slugify.
 * @returns A slugified string.
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars but hyphens
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
