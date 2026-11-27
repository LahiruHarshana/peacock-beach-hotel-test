"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminPage } from "@/components/admin/admin-page";
import { Button } from "@/components/ui/button";

type ReviewItem = {
  _id: string;
  authorDisplayName: string;
  text: string;
  locale: string;
};

export default function AdminReviewsPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setItems(json.data.items ?? []);
      });
  }, []);

  async function moderate(id: string, action: "APPROVE" | "REJECT") {
    const res = await fetch(`/api/admin/reviews/${id}/moderate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error?.message ?? "Moderation failed");
      return;
    }
    setItems((prev) => prev.filter((item) => item._id !== id));
    toast.success(action === "APPROVE" ? "Review approved" : "Review rejected");
  }

  return (
    <AdminPage title="Reviews" lede="Only approved reviews appear on the public site. Pending submissions stay here until you decide.">
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="rounded-[1.4rem] bg-greige px-6 py-10 text-sm text-mocha/75">No pending reviews.</p>
        ) : (
          items.map((review) => (
            <article key={review._id} className="rounded-[1.4rem] bg-greige p-6 ring-1 ring-mocha/[0.06]">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.14rem] text-mocha/75">
                {review.authorDisplayName} · {review.locale}
              </p>
              <p className="mt-4 text-lg leading-7 tracking-[-0.03em]">“{review.text}”</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={() => moderate(review._id, "APPROVE")}>
                  Approve
                </Button>
                <Button size="sm" variant="secondary" onClick={() => moderate(review._id, "REJECT")}>
                  Reject
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </AdminPage>
  );
}
