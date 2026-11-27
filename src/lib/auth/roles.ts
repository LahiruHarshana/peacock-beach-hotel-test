export const ROLES = ["OWNER", "EDITOR", "REVIEW_MODERATOR"] as const;
export type UserRole = (typeof ROLES)[number];

export const PERMISSIONS = [
  "rooms:read",
  "rooms:write",
  "events:read",
  "events:write",
  "reviews:read",
  "reviews:moderate",
  "media:write",
  "audit:read",
  "settings:write",
  "users:manage",
  "dining:read",
  "dining:write",
] as const;

export type AdminPermission = (typeof PERMISSIONS)[number];

const rolePermissions: Record<UserRole, readonly AdminPermission[]> = {
  OWNER: PERMISSIONS,
  EDITOR: [
    "rooms:read",
    "rooms:write",
    "events:read",
    "events:write",
    "reviews:read",
    "media:write",
    "dining:read",
    "dining:write",
  ],
  REVIEW_MODERATOR: ["reviews:read", "reviews:moderate"],
};

export function roleHasPermission(role: UserRole, permission: AdminPermission): boolean {
  return rolePermissions[role].includes(permission);
}
