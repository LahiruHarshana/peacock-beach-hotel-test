import { ROLES, type UserRole } from "@/lib/auth/roles";

export type StaffAccess =
  | { ok: true; role: UserRole }
  | { ok: false; reason: "missing" | "disabled" | "revoked" | "unknown-role" };

export function resolveStaffAccess(input: {
  status?: string | null;
  role?: string | null;
  recordTokenVersion?: number | null;
  sessionTokenVersion?: number | null;
}): StaffAccess {
  if (!input.status || !input.role) return { ok: false, reason: "missing" };
  if (input.status !== "ACTIVE") return { ok: false, reason: "disabled" };
  if (!ROLES.includes(input.role as UserRole)) return { ok: false, reason: "unknown-role" };
  const recordVersion = input.recordTokenVersion ?? 0;
  const sessionVersion = input.sessionTokenVersion ?? 0;
  if (recordVersion !== sessionVersion) return { ok: false, reason: "revoked" };
  return { ok: true, role: input.role as UserRole };
}
