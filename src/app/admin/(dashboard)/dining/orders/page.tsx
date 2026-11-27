import { AdminPage, adminTableClass } from "@/components/admin/admin-page";
import { StatusControl } from "@/components/admin/dining-desk";
import { listOrders } from "@/server/repositories/dining";

const statuses = ["RECEIVED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

export default async function AdminOrdersPage() {
  const { items } = await listOrders();
  return (
    <AdminPage title="Orders" lede="Guests pay at the restaurant. Update the status as the kitchen works.">
      <div className={adminTableClass()}>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-mocha/10 text-[0.65rem] uppercase tracking-[0.14rem] text-mocha/75">
            <tr><th className="px-5 py-4">Code</th><th className="px-5 py-4">Guest</th><th className="px-5 py-4">Total</th><th className="px-5 py-4">Items</th><th className="px-5 py-4">Status</th></tr>
          </thead>
          <tbody>
            {items.length === 0 ? <tr><td className="px-5 py-10 text-mocha/75" colSpan={5}>No orders yet.</td></tr> : items.map((item) => (
              <tr key={String(item._id)} className="border-b border-mocha/5">
                <td className="px-5 py-4">{item.code}</td>
                <td className="px-5 py-4">{item.guestName}</td>
                <td className="px-5 py-4">{item.currency} {item.total}</td>
                <td className="px-5 py-4">{item.items.map((line) => `${line.quantity}× ${line.name.en}`).join(", ")}</td>
                <td className="px-5 py-4"><StatusControl id={String(item._id)} version={item.version} status={item.status} kind="orders" options={statuses} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}
