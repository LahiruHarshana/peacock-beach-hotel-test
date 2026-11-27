const KEY = "peacock-intro";

export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return true;
  }
}

export function markIntroSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, "1");
  } catch {
    /* private mode: skip persistence rather than blocking the page */
  }
}

export const HERO_READY_EVENT = "peacock:hero-ready";
export const INTRO_DONE_EVENT = "peacock:intro-done";

export function signalHeroReady(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(HERO_READY_EVENT));
}

export function signalIntroDone(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}
