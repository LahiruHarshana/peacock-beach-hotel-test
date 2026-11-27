import "server-only";
import { auth } from "@/lib/auth/auth";
import { type AdminPermission, type UserRole, roleHasPermission } from "@/lib/auth/roles";
import { getEnv } from "@/lib/env";
import { isAllowedOrigin } from "@/lib/security/origin";
import { resolveStaffAccess } from "@/lib/security/staff-access";
import { findStaffById } from "@/server/repositories/users";
import { AuthError } from "@/lib/auth/errors";

export { AuthError };

export type AdminSessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export async function getAdminSessionUser(): Promise<AdminSessionUser | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const record = await findStaffById(id);
  const decision = resolveStaffAccess({
    status: record?.status,
    role: record?.role,
    recordTokenVersion: record?.tokenVersion ?? 0,
    sessionTokenVersion: session?.user?.tokenVersion ?? 0,
  });
  if (!decision.ok || !record) return null;

  return {
    id,
    email: record.emailNormalized,
    name: record.name || record.emailNormalized,
    role: decision.role,
  };
}

export async function requireAdminPermission(
  permission: AdminPermission,
  req?: Request,
): Promise<AdminSessionUser> {
  if (req && !isAllowedOrigin(req.headers.get("origin"), getEnv().APP_URL)) {
    throw new AuthError("FORBIDDEN", "Cross-origin request rejected.");
  }
  const user = await getAdminSessionUser();
  if (!user) {
    throw new AuthError("UNAUTHORIZED", "Authentication required.");
  }
  if (!roleHasPermission(user.role, permission)) {
    throw new AuthError("FORBIDDEN", "You do not have permission for this action.");
  }
  return user;
}
