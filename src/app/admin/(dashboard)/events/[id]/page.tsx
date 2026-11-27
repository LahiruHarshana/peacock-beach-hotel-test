import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin/admin-page";
import { EventEditor } from "@/components/admin/event-editor";
import { getEventById } from "@/server/repositories/events";

type PageProps = { params: Promise<{ id: string }> };

function dateInput(value: Date) {
  return new Date(value).toISOString().slice(0, 16);
}

export default async function AdminEditEventPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEventById(id).catch(() => null);
  if (!event) notFound();

  return (
    <AdminPage title="Edit event" lede={event.slug}>
      <EventEditor
        mode="edit"
        initial={{
          id,
          version: event.version,
          slug: event.slug,
          titleEn: event.title.en,
          titleRu: event.title.ru,
          descriptionEn: event.description.en,
          descriptionRu: event.description.ru,
          startAt: dateInput(event.startAt),
          endAt: dateInput(event.endAt),
          heroPublicId: event.heroMedia?.publicId ?? null,
        }}
      />
    </AdminPage>
  );
}
