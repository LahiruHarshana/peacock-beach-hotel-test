export function isAllowedOrigin(origin: string | null, appUrl: string): boolean {
  if (!origin) return true;
  try {
    return origin === new URL(appUrl).origin;
  } catch {
    return false;
  }
}
