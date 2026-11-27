"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaUploader } from "@/components/admin/media-uploader";

type Props = {
  mode: "create" | "edit";
  initial?: {
    id?: string;
    version?: number;
    slug?: string;
    titleEn?: string;
    titleRu?: string;
    descriptionEn?: string;
    descriptionRu?: string;
    startAt?: string;
    endAt?: string;
    heroPublicId?: string | null;
  };
};

export function EventEditor({ mode, initial }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [heroPublicId, setHeroPublicId] = useState(initial?.heroPublicId ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function payload() {
    return {
      slug: (document.getElementById("slug") as HTMLInputElement).value,
      title: {
        en: (document.getElementById("titleEn") as HTMLInputElement).value,
        ru: (document.getElementById("titleRu") as HTMLInputElement).value,
      },
      description: {
        en: (document.getElementById("descriptionEn") as HTMLTextAreaElement).value,
        ru: (document.getElementById("descriptionRu") as HTMLTextAreaElement).value,
      },
      startAt: (document.getElementById("startAt") as HTMLInputElement).value,
      endAt: (document.getElementById("endAt") as HTMLInputElement).value,
      heroMedia: heroPublicId ? { publicId: heroPublicId, resourceType: "image" as const } : null,
      status: "DRAFT" as const,
    };
  }

  async function saveDraft() {
    setLoading(true);
    setFieldErrors({});
    try {
      const body = payload();
      const res =
        mode === "create"
          ? await fetch("/api/admin/events", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            })
          : await fetch(`/api/admin/events/${initial?.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...body, version: initial?.version ?? 1 }),
            });
      const json = await res.json();
      if (!json.ok) {
        setFieldErrors(json.error?.fieldErrors ?? {});
        throw new Error(json.error?.message ?? "Save failed");
      }
      toast.success(mode === "create" ? "Event draft created" : "Draft saved");
      if (mode === "create") router.push(`/admin/events/${json.data.id}`);
      else router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save event");
    } finally {
      setLoading(false);
    }
  }

  async function publish() {
    if (!window.confirm("Publish this event on the public site?")) return;
    setLoading(true);
    try {
      const version = initial?.version ?? 1;
      const saved = await fetch(`/api/admin/events/${initial?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload(), version }),
      });
      const savedJson = await saved.json();
      if (!savedJson.ok) {
        setFieldErrors(savedJson.error?.fieldErrors ?? {});
        throw new Error(savedJson.error?.message ?? "Save failed");
      }
      const pub = await fetch(`/api/admin/events/${initial?.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: version + 1 }),
      });
      const pubJson = await pub.json();
      if (!pubJson.ok) {
        setFieldErrors(pubJson.error?.fieldErrors ?? {});
        throw new Error(pubJson.error?.message ?? "Publish failed");
      }
      toast.success("Event published");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to publish event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="space-y-5 rounded-[1.4rem] bg-greige p-6 ring-1 ring-mocha/[0.06] sm:p-8">
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" defaultValue={initial?.slug} disabled={mode === "edit"} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="titleEn">Title (EN)</Label>
            <Input id="titleEn" defaultValue={initial?.titleEn} />
          </div>
          <div>
            <Label htmlFor="titleRu">Title (RU)</Label>
            <Input id="titleRu" defaultValue={initial?.titleRu} />
          </div>
        </div>
        <div>
          <Label htmlFor="descriptionEn">Description (EN)</Label>
          <Textarea id="descriptionEn" defaultValue={initial?.descriptionEn} />
        </div>
        <div>
          <Label htmlFor="descriptionRu">Description (RU)</Label>
          <Textarea id="descriptionRu" defaultValue={initial?.descriptionRu} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="startAt">Starts</Label>
            <Input id="startAt" type="datetime-local" defaultValue={initial?.startAt} />
          </div>
          <div>
            <Label htmlFor="endAt">Ends</Label>
            <Input id="endAt" type="datetime-local" defaultValue={initial?.endAt} />
          </div>
        </div>
        {heroPublicId ? <p className="text-sm text-mocha/75">Image: {heroPublicId}</p> : null}
        {Object.keys(fieldErrors).length > 0 ? (
          <ul className="text-sm text-error" role="alert">
            {Object.entries(fieldErrors).flatMap(([key, messages]) =>
              messages.map((message) => <li key={`${key}-${message}`}>{key}: {message}</li>),
            )}
          </ul>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" disabled={loading} onClick={saveDraft}>
            {loading ? "Saving…" : "Save draft"}
          </Button>
          {mode === "edit" ? (
            <Button type="button" disabled={loading} onClick={publish}>
              Publish
            </Button>
          ) : null}
        </div>
      </div>
      <MediaUploader category="events" onUploaded={(asset) => setHeroPublicId(asset.publicId)} />
    </div>
  );
}
