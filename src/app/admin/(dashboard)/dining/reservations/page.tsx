import { AdminPage, adminTableClass } from "@/components/admin/admin-page";
import { StatusControl } from "@/components/admin/dining-desk";
import { formatMinutes } from "@/lib/dining/slots";
import { listReservations } from "@/server/repositories/dining";

const statuses = ["CONFIRMED", "SEATED", "COMPLETED", "NO_SHOW", "CANCELLED"];

export default async function AdminReservationsPage() {
  const { items } = await listReservations();
  return (
    <AdminPage title="Reservations" lede="Confirmed reservations hold a table for the seating length.">
      <div className={adminTableClass()}>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-mocha/10 text-[0.65rem] uppercase tracking-[0.14rem] text-mocha/75">
            <tr><th className="px-5 py-4">Code</th><th className="px-5 py-4">When</th><th className="px-5 py-4">Table</th><th className="px-5 py-4">Guest</th><th className="px-5 py-4">Status</th></tr>
          </thead>
          <tbody>
            {items.length === 0 ? <tr><td className="px-5 py-10 text-mocha/75" colSpan={5}>No reservations yet.</td></tr> : items.map((item) => (
              <tr key={String(item._id)} className="border-b border-mocha/5">
                <td className="px-5 py-4">{item.code}</td>
                <td className="px-5 py-4">{item.date} {formatMinutes(item.startMinutes)}</td>
                <td className="px-5 py-4">{item.tableName} · {item.guests}</td>
                <td className="px-5 py-4">{item.guestName}</td>
                <td className="px-5 py-4"><StatusControl id={String(item._id)} version={item.version} status={item.status} kind="reservations" options={statuses} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}
