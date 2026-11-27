import Link from "next/link";
import { AdminPage, adminPrimaryLinkClass, adminTableClass } from "@/components/admin/admin-page";
import { Badge } from "@/components/ui/badge";
import { listRoomsForAdmin } from "@/server/repositories/rooms";

export default async function AdminRoomsPage() {
  const { items } = await listRoomsForAdmin();

  return (
    <AdminPage
      title="Rooms"
      lede="Drafts stay private until you publish them. Public pages only show published rooms."
      action={
        <Link href="/admin/rooms/new" className={adminPrimaryLinkClass()}>
          New room
        </Link>
      }
    >
      <div className={adminTableClass()}>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-mocha/10 text-[0.65rem] uppercase tracking-[0.14rem] text-mocha/75">
            <tr>
              <th className="px-5 py-4 font-medium">Slug</th>
              <th className="px-5 py-4 font-medium">Name</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Version</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-mocha/75">
                  No rooms yet. Create a draft to begin.
                </td>
              </tr>
            ) : (
              items.map((room) => (
                <tr key={String(room._id)} className="border-b border-mocha/5 last:border-0">
                  <td className="px-5 py-4">
                    <Link href={`/admin/rooms/${String(room._id)}`} className="font-medium underline-offset-4 hover:underline">
                      {room.slug}
                    </Link>
                  </td>
                  <td className="px-5 py-4">{room.name.en}</td>
                  <td className="px-5 py-4">
                    <Badge variant={room.status === "PUBLISHED" ? "default" : "outline"}>{room.status}</Badge>
                  </td>
                  <td className="px-5 py-4 font-serif italic text-mocha/75">{room.version}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}
