/**
 * Quiet Routes Registry (Delta D6)
 * Defines route paths that mandate a clean, distraction-free layout:
 * - 0 analytics or tracking scripts
 * - 0 chatbot / live chat widgets
 * - 0 sound prompt or ambient music
 * - 0 command palette or global keyboard hijackers
 * - 0 Play Mode or cursor canvas effects
 * - 100% native selectable and copyable text
 * - 100% self-hosted assets only
 */

export const QUIET_ROUTES = [
  '/extensions/kuracode/demo',
  '/extensions/kuracode/review',
  '/extensions/kuracode/welcome',
  '/extensions/kuracode/update',
];

export function isQuietRoute(pathname) {
  if (!pathname) return false;
  return QUIET_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'));
}

export default isQuietRoute;
