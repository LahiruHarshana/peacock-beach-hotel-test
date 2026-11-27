import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSessionUser } from "@/lib/auth/session";

import type { ChildrenProps } from "@/types/page-props";

export default async function AdminDashboardLayout({
  children,
}: ChildrenProps) {
  const user = await getAdminSessionUser();
  if (!user) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
