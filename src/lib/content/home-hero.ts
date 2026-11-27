export const HOME_HERO_THEMES = ["dark", "light"] as const;

export type HomeHeroTheme = (typeof HOME_HERO_THEMES)[number];

export function resolveHomeHeroTheme(value: string | null | undefined): HomeHeroTheme {
  return value === "dark" ? "dark" : "light";
}