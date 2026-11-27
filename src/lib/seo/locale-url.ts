/** Absolute locale URL from the configured APP_URL. No host is hardcoded here. */
export function localeAbsoluteUrl(appUrl: string, locale: string, path = ""): string {
  const base = appUrl.replace(/\/$/, "");
  const suffix = path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${base}/${locale}${suffix}`;
}
