export const MOTION = "(prefers-reduced-motion: no-preference)";
export const DESKTOP_MOTION = `${MOTION} and (min-width: 768px)`;

export function setHeaderOverHero(active: boolean) {
  const header = document.querySelector("header");
  if (!header) return;
  if (active) header.setAttribute("data-over-hero", "");
  else header.removeAttribute("data-over-hero");
}
