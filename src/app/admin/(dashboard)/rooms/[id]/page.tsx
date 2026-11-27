import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin/admin-page";
import { RoomEditor } from "@/components/admin/room-editor";
import { getRoomById } from "@/server/repositories/rooms";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditRoomPage({ params }: PageProps) {
  const { id } = await params;
  const room = await getRoomById(id).catch(() => null);
  if (!room) notFound();

  return (
    <AdminPage title="Edit room" lede={room.slug}>
      <RoomEditor
        mode="edit"
        initial={{
          id,
          version: room.version,
          slug: room.slug,
          nameEn: room.name.en,
          nameRu: room.name.ru,
          descriptionEn: room.description.en,
          descriptionRu: room.description.ru,
          capacity: room.capacity,
          amenities: room.amenities,
          priceDisplay: room.priceDisplay,
          currency: room.currency,
          status: room.status,
          images: room.images.map((image) => ({
            publicId: image.publicId,
            altEn: image.alt.en,
            altRu: image.alt.ru,
          })),
        }}
      />
    </AdminPage>
  );
}
