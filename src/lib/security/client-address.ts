const IPV4 = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const IPV6 = /^[0-9a-f:]+$/i;

/** Client address for rate limits. Hops of 0 ignore forwarded headers. */
export function clientAddress(
  headers: { get(name: string): string | null },
  trustedProxyHops: number,
): string {
  if (!Number.isInteger(trustedProxyHops) || trustedProxyHops <= 0) return "direct";
  const forwarded = headers.get("x-forwarded-for");
  if (!forwarded) return "unknown";
  const parts = forwarded
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const candidate = parts[parts.length - trustedProxyHops] ?? "";
  if (!candidate || candidate.length > 64) return "unknown";
  if (!IPV4.test(candidate) && !IPV6.test(candidate)) return "unknown";
  return candidate;
}
