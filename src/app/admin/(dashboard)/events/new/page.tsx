import { AdminPage } from "@/components/admin/admin-page";
import { EventEditor } from "@/components/admin/event-editor";

export default function AdminNewEventPage() {
  return (
    <AdminPage title="New event" lede="Drafts stay off the public events page until you publish them.">
      <EventEditor mode="create" />
    </AdminPage>
  );
}
