import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines conditional classnames using clsx and merges conflicting Tailwind classes.
 * Standard utility for shadcn/ui, Aceternity UI, and Inspira UI React components.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;
