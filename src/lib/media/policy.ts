export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp", "avif"] as const;
export const MEDIA_CATEGORIES = ["rooms", "events", "restaurant", "general"] as const;
export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];
export type MediaEnvironment = "development" | "staging" | "production";

export const DEVELOPMENT_MEDIA_NAMESPACE = "peacock/dev";
export const TEST_MEDIA_NAMESPACE = "peacock-test";
export const PRODUCTION_MEDIA_NAMESPACE = "peacock/prod";
export const LEGACY_MEDIA_ROOT = "peacock";

const ASSET_NAME = "[A-Za-z0-9][A-Za-z0-9_-]{0,80}";

export function currentMediaEnvironment(): MediaEnvironment {
  if (process.env.PEACOCK_ENV === "staging" || process.env.PEACOCK_ENV === "production") {
    return process.env.PEACOCK_ENV;
  }
  return "development";
}

export function writableMediaNamespace(environment = currentMediaEnvironment()): string {
  if (environment === "staging") return TEST_MEDIA_NAMESPACE;
  if (environment === "production") return PRODUCTION_MEDIA_NAMESPACE;
  return DEVELOPMENT_MEDIA_NAMESPACE;
}

export function hasUnsafeMediaPath(publicId: string): boolean {
  return (
    publicId !== publicId.trim() ||
    publicId.includes("..") ||
    publicId.includes("//") ||
    publicId.includes("\\") ||
    publicId.includes("?") ||
    publicId.includes("#") ||
    publicId.startsWith("/")
  );
}

function matchesNamespace(publicId: string, namespace: string, category?: string): boolean {
  const categories = category ? [category] : [...MEDIA_CATEGORIES];
  return categories.some((item) =>
    new RegExp(`^${namespace}/${item}/${ASSET_NAME}$`).test(publicId),
  );
}

export function isUploadPublicId(
  publicId: string,
  category: string,
  environment = currentMediaEnvironment(),
): boolean {
  if (hasUnsafeMediaPath(publicId) || !MEDIA_CATEGORIES.includes(category as MediaCategory)) return false;
  return matchesNamespace(publicId, writableMediaNamespace(environment), category);
}

/** New uploads use the active namespace. Existing development and production records may keep peacock/{category}. */
export function isSelectablePublicId(
  publicId: string,
  category?: string,
  environment = currentMediaEnvironment(),
): boolean {
  if (hasUnsafeMediaPath(publicId)) return false;
  if (matchesNamespace(publicId, writableMediaNamespace(environment), category)) return true;
  if (environment === "staging") return false;
  return matchesNamespace(publicId, LEGACY_MEDIA_ROOT, category);
}

export function canDisplayPublicId(publicId: string, environment = currentMediaEnvironment()): boolean {
  return isSelectablePublicId(publicId, undefined, environment);
}

/** Tests may delete only peacock-test assets. Other environments delete only their own namespace. */
export function canDestroyAsset(publicId: string, environment = currentMediaEnvironment()): boolean {
  if (hasUnsafeMediaPath(publicId)) return false;
  if (process.env.PEACOCK_PROTECT_SHARED_MEDIA === "1") {
    return matchesNamespace(publicId, TEST_MEDIA_NAMESPACE);
  }
  return matchesNamespace(publicId, writableMediaNamespace(environment));
}

export function isAllowedPublicId(publicId: string, category: string): boolean {
  return isUploadPublicId(publicId, category);
}

export function activeMediaRoot(): string {
  return writableMediaNamespace();
}

export function isAllowedImage(format: string | undefined, bytes: number | undefined): boolean {
  if (!format || bytes == null) return false;
  return (
    ALLOWED_IMAGE_FORMATS.includes(format.toLowerCase() as (typeof ALLOWED_IMAGE_FORMATS)[number]) &&
    bytes > 0 &&
    bytes <= MAX_IMAGE_BYTES
  );
}
