import Link from "next/link";
import { AdminPage, adminPrimaryLinkClass, adminTableClass } from "@/components/admin/admin-page";
import { EventDeleteButton } from "@/components/admin/event-delete-button";
import { Badge } from "@/components/ui/badge";
import { listEventsForAdmin } from "@/server/repositories/events";

export default async function AdminEventsPage() {
  const { items } = await listEventsForAdmin();

  return (
    <AdminPage
      title="Events"
      lede="Upcoming and past offers appear on the public events page only after they are published."
      action={
        <Link href="/admin/events/new" className={adminPrimaryLinkClass()}>
          New event
        </Link>
      }
    >
      <div className={adminTableClass()}>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-mocha/10 text-[0.65rem] uppercase tracking-[0.14rem] text-mocha/75">
            <tr>
              <th className="px-5 py-4 font-medium">Slug</th>
              <th className="px-5 py-4 font-medium">Title</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-mocha/75">
                  No events yet. Create a draft to start.
                </td>
              </tr>
            ) : (
              items.map((event) => (
                <tr key={String(event._id)} className="border-b border-mocha/5 last:border-0">
                  <td className="px-5 py-4">
                    <Link href={`/admin/events/${String(event._id)}`} className="font-medium underline-offset-4 hover:underline">
                      {event.slug}
                    </Link>
                  </td>
                  <td className="px-5 py-4">{event.title.en}</td>
                  <td className="px-5 py-4">
                    <Badge variant={event.status === "PUBLISHED" ? "default" : "outline"}>{event.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <EventDeleteButton id={String(event._id)} version={event.version} slug={event.slug} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}
