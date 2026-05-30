/**
 * Tailwind CSS class merge utility.
 * Simple implementation — combines and deduplicates class strings.
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
