"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function EventDeleteButton({ id, version, slug }: { id: string; version: number; slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    if (!window.confirm(`Delete event “${slug}”? This cannot be undone.`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/events/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.ok) {
      toast.error(json.error?.message ?? "Could not delete event");
      return;
    }
    toast.success("Event deleted");
    router.refresh();
  }

  return (
    <Button type="button" variant="destructive" size="sm" disabled={loading} onClick={remove}>
      Delete
    </Button>
  );
}
