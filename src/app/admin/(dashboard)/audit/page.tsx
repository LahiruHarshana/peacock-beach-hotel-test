import { AdminPage, adminTableClass } from "@/components/admin/admin-page";
import { getDb } from "@/lib/db/client";
import { COLLECTIONS } from "@/lib/db/collections";
import { AuthError, requireAdminPermission } from "@/lib/auth/session";

export default async function AdminAuditPage() {
  try {
    await requireAdminPermission("audit:read");
  } catch (error) {
    if (error instanceof AuthError) {
      return (
        <AdminPage title="Audit">
          <p className="text-sm text-mocha/75" role="alert">
            You do not have permission to view the audit log.
          </p>
        </AdminPage>
      );
    }
    throw error;
  }
  const db = await getDb();
  const logs = await db
    .collection(COLLECTIONS.auditLogs)
    .find({})
    .sort({ at: -1 })
    .limit(100)
    .toArray();

  return (
    <AdminPage title="Audit" lede="Recent staff actions, newest first. This list is limited to the latest 100 entries.">
      <div className={adminTableClass()}>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-mocha/10 text-[0.65rem] uppercase tracking-[0.14rem] text-mocha/75">
            <tr>
              <th className="px-5 py-4 font-medium">When</th>
              <th className="px-5 py-4 font-medium">Action</th>
              <th className="px-5 py-4 font-medium">Target</th>
              <th className="px-5 py-4 font-medium">Summary</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-mocha/75">
                  No audit entries yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={String(log._id)} className="border-b border-mocha/5 last:border-0">
                  <td className="whitespace-nowrap px-5 py-4 text-mocha/75">
                    {new Date(log.at as Date).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  </td>
                  <td className="px-5 py-4">{String(log.action)}</td>
                  <td className="px-5 py-4">
                    {String(log.targetType)}:{String(log.targetId)}
                  </td>
                  <td className="px-5 py-4">{String(log.summary)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}
