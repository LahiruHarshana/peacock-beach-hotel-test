import Link from "next/link";
import { roleHasPermission, type AdminPermission } from "@/lib/auth/roles";
import { getAdminSessionUser } from "@/lib/auth/session";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";

const links: Array<{ href: string; label: string; permission?: AdminPermission }> = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/rooms", label: "Rooms", permission: "rooms:read" },
  { href: "/admin/events", label: "Events", permission: "events:read" },
  { href: "/admin/reviews", label: "Reviews", permission: "reviews:read" },
  { href: "/admin/dining/tables", label: "Tables", permission: "dining:read" },
  { href: "/admin/dining/reservations", label: "Reservations", permission: "dining:read" },
  { href: "/admin/dining/menu", label: "Menu", permission: "dining:read" },
  { href: "/admin/dining/orders", label: "Orders", permission: "dining:read" },
  { href: "/admin/media", label: "Media", permission: "media:write" },
  { href: "/admin/settings", label: "Settings", permission: "users:manage" },
  { href: "/admin/audit", label: "Audit", permission: "audit:read" },
];

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const user = await getAdminSessionUser();
  const visible = links.filter((link) => !link.permission || (user && roleHasPermission(user.role, link.permission)));

  return (
    <div className="min-h-screen bg-ivory text-mocha md:grid md:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="border-b border-mocha/10 bg-greige md:sticky md:top-0 md:h-screen md:overflow-y-auto md:border-b-0 md:border-r">
        <div className="px-5 py-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-mocha/70">
              <span className="h-2.5 w-2.5 rounded-full bg-mocha" />
              <span className="absolute right-[-0.125rem] top-1/2 h-px w-3 -translate-y-1/2 bg-mocha" />
            </span>
            <span className="text-sm font-medium tracking-[-0.03em]">Peacock</span>
          </Link>
          <p className="mt-5 text-[0.65rem] font-medium uppercase tracking-[0.16rem] text-mocha/75">Content studio</p>
          {user ? <p className="mt-2 truncate text-sm text-mocha/75">{user.email}</p> : null}
        </div>
        <AdminNav links={visible.map(({ href, label }) => ({ href, label }))} />
        {user ? (
          <div className="px-4 pb-6">
            <AdminSignOutButton />
          </div>
        ) : null}
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
