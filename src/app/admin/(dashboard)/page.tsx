import Link from "next/link";
import { AdminPage } from "@/components/admin/admin-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDb } from "@/lib/db/client";
import { COLLECTIONS } from "@/lib/db/collections";

export default async function AdminOverviewPage() {
  const db = await getDb();
  const [rooms, events, pendingReviews] = await Promise.all([
    db.collection(COLLECTIONS.rooms).countDocuments(),
    db.collection(COLLECTIONS.events).countDocuments(),
    db.collection(COLLECTIONS.reviews).countDocuments({ moderationStatus: "PENDING" }),
  ]);

  const stats = [
    { label: "Rooms", value: rooms, href: "/admin/rooms" },
    { label: "Events", value: events, href: "/admin/events" },
    { label: "Pending reviews", value: pendingReviews, href: "/admin/reviews" },
  ];

  return (
    <AdminPage
      title="Dashboard"
      lede="A quick view of published content and reviews waiting for moderation. This site does not take live bookings."
    >
      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group">
            <Card className="h-full transition-transform group-hover:-translate-y-1">
              <CardHeader>
                <CardTitle>{stat.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-6xl font-medium tracking-[-0.06em]">{stat.value}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AdminPage>
  );
}
