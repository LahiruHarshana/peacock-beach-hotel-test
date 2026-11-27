import { AdminPage, adminTableClass } from "@/components/admin/admin-page";
import { DiningHoursForm, DiningTableForm } from "@/components/admin/dining-desk";
import { getDiningConfig, listTables } from "@/server/repositories/dining";

export default async function AdminTablesPage() {
  const [config, tables] = await Promise.all([getDiningConfig(), listTables(false)]);
  return (
    <AdminPage title="Tables" lede={`Seating lasts ${config.durationMinutes} minutes (${config.timezone}). Service runs ${config.openTime} to ${config.closeTime}.`}>
      <div className="mb-8 space-y-4">
        <DiningHoursForm openTime={config.openTime} closeTime={config.closeTime} slotMinutes={config.slotMinutes} durationMinutes={config.durationMinutes} maxPartySize={config.maxPartySize} />
        <DiningTableForm />
      </div>
      <div className={adminTableClass()}>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-mocha/10 text-[0.65rem] uppercase tracking-[0.14rem] text-mocha/75">
            <tr><th className="px-5 py-4">Name</th><th className="px-5 py-4">Seats</th><th className="px-5 py-4">Active</th></tr>
          </thead>
          <tbody>
            {tables.length === 0 ? <tr><td className="px-5 py-10 text-mocha/75" colSpan={3}>No tables yet.</td></tr> : tables.map((table) => (
              <tr key={String(table._id)} className="border-b border-mocha/5">
                <td className="px-5 py-4">{table.name}</td>
                <td className="px-5 py-4">{table.seats}</td>
                <td className="px-5 py-4">{table.active ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}
