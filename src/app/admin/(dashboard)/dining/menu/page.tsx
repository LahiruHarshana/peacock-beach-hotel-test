import { AdminPage, adminTableClass } from "@/components/admin/admin-page";
import { MenuItemForm } from "@/components/admin/dining-desk";
import { listMenu } from "@/server/repositories/dining";

export default async function AdminMenuPage() {
  const items = await listMenu(false);
  return (
    <AdminPage title="Menu" lede="Only published dishes appear on the public menu. Guests pay at the restaurant.">
      <div className="mb-8"><MenuItemForm /></div>
      <div className={adminTableClass()}>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-mocha/10 text-[0.65rem] uppercase tracking-[0.14rem] text-mocha/75">
            <tr><th className="px-5 py-4">Dish</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Status</th></tr>
          </thead>
          <tbody>
            {items.length === 0 ? <tr><td className="px-5 py-10 text-mocha/75" colSpan={3}>No dishes yet.</td></tr> : items.map((item) => (
              <tr key={String(item._id)} className="border-b border-mocha/5">
                <td className="px-5 py-4">{item.name.en}</td>
                <td className="px-5 py-4">{item.currency} {item.price}</td>
                <td className="px-5 py-4">{item.published ? "Published" : "Draft"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}
