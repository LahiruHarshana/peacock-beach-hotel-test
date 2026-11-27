import { AdminPage } from "@/components/admin/admin-page";
import { RoomEditor } from "@/components/admin/room-editor";

export default function AdminNewRoomPage() {
  return (
    <AdminPage title="New room" lede="Save a draft first. Publish only after names, descriptions, and at least one verified photograph are ready.">
      <RoomEditor mode="create" />
    </AdminPage>
  );
}
