"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaUploader } from "@/components/admin/media-uploader";

type ImageDraft = { publicId: string; altEn: string; altRu: string };

type Props = {
  mode: "create" | "edit";
  initial?: {
    id?: string;
    version?: number;
    slug?: string;
    nameEn?: string;
    nameRu?: string;
    descriptionEn?: string;
    descriptionRu?: string;
    capacity?: number;
    amenities?: string[];
    images?: ImageDraft[];
    priceDisplay?: number | null;
    currency?: string;
    status?: "DRAFT" | "PUBLISHED";
  };
};

export function RoomEditor({ mode, initial }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [images, setImages] = useState<ImageDraft[]>(initial?.images ?? []);

  function readPayload() {
    const amenities = (document.getElementById("amenities") as HTMLInputElement).value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const priceRaw = (document.getElementById("priceDisplay") as HTMLInputElement).value;
    return {
      slug: (document.getElementById("slug") as HTMLInputElement).value,
      name: {
        en: (document.getElementById("nameEn") as HTMLInputElement).value,
        ru: (document.getElementById("nameRu") as HTMLInputElement).value,
      },
      description: {
        en: (document.getElementById("descriptionEn") as HTMLTextAreaElement).value,
        ru: (document.getElementById("descriptionRu") as HTMLTextAreaElement).value,
      },
      capacity: Number((document.getElementById("capacity") as HTMLInputElement).value),
      amenities,
      images: images.map((image, order) => ({
        publicId: image.publicId,
        alt: { en: image.altEn, ru: image.altRu },
        order,
      })),
      priceDisplay: priceRaw === "" ? null : Number(priceRaw),
      currency: (document.getElementById("currency") as HTMLInputElement).value || "USD",
      sortOrder: 0,
      status: "DRAFT" as const,
    };
  }

  async function detachImage(publicId: string) {
    if (publicId.startsWith("peacock-test/")) {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        toast.error(json?.error?.message ?? "The test image was not deleted.");
        return;
      }
      toast.success("Test image deleted.");
    }
    setImages((current) => current.filter((image) => image.publicId !== publicId));
  }

  async function saveDraft() {
    setLoading(true);
    setFieldErrors({});
    try {
      const payload = readPayload();
      const res =
        mode === "create"
          ? await fetch("/api/admin/rooms", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/rooms/${initial?.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...payload, version: initial?.version ?? 1 }),
            });
      const json = await res.json();
      if (!json.ok) {
        setFieldErrors(json.error?.fieldErrors ?? {});
        throw new Error(json.error?.message ?? "Save failed");
      }
      toast.success(mode === "create" ? "Draft created" : "Draft saved");
      if (mode === "create") router.push(`/admin/rooms/${json.data.id}`);
      else router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save room");
    } finally {
      setLoading(false);
    }
  }

  async function publish() {
    if (!window.confirm("Publish this room on the public site?")) return;
    setLoading(true);
    setFieldErrors({});
    try {
      const payload = readPayload();
      const version = initial?.version ?? 1;
      const saved = await fetch(`/api/admin/rooms/${initial?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, version }),
      });
      const savedJson = await saved.json();
      if (!savedJson.ok) {
        setFieldErrors(savedJson.error?.fieldErrors ?? {});
        throw new Error(savedJson.error?.message ?? "Save failed");
      }
      const pub = await fetch(`/api/admin/rooms/${initial?.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: version + 1 }),
      });
      const pubJson = await pub.json();
      if (!pubJson.ok) {
        setFieldErrors(pubJson.error?.fieldErrors ?? {});
        throw new Error(pubJson.error?.message ?? "Publish failed");
      }
      toast.success("Room published");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to publish room");
    } finally {
      setLoading(false);
    }
  }

  async function unpublish() {
    if (!window.confirm("Remove this room from the public site? It will return to draft.")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/rooms/${initial?.id}/unpublish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: initial?.version ?? 1 }),
      });
      const json = await response.json();
      if (!json.ok) throw new Error(json.error?.message ?? "Unpublish failed");
      toast.success("Room returned to draft");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to unpublish room");
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
            <Label htmlFor="nameEn">Name (EN)</Label>
            <Input id="nameEn" defaultValue={initial?.nameEn} />
          </div>
          <div>
            <Label htmlFor="nameRu">Name (RU)</Label>
            <Input id="nameRu" defaultValue={initial?.nameRu} />
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
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input id="capacity" type="number" min={1} max={20} defaultValue={initial?.capacity ?? 2} />
          </div>
          <div>
            <Label htmlFor="priceDisplay">Display price (optional)</Label>
            <Input id="priceDisplay" type="number" min={0} defaultValue={initial?.priceDisplay ?? ""} />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" maxLength={3} defaultValue={initial?.currency ?? "USD"} />
          </div>
        </div>
        <div>
          <Label htmlFor="amenities">Amenities (comma separated)</Label>
          <Input id="amenities" defaultValue={initial?.amenities?.join(", ") ?? ""} />
        </div>
        <FieldErrors errors={fieldErrors} />
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" disabled={loading} onClick={saveDraft}>
            {loading ? "Saving…" : "Save draft"}
          </Button>
          {mode === "edit" ? (
            <Button type="button" disabled={loading} onClick={publish}>
              Publish
            </Button>
          ) : null}
          {mode === "edit" && initial?.status === "PUBLISHED" ? (
            <Button type="button" variant="secondary" disabled={loading} onClick={unpublish}>
              Unpublish
            </Button>
          ) : null}
        </div>
      </div>
      <MediaUploader
        category="rooms"
        onUploaded={(asset) =>
          setImages((current) => [...current, { publicId: asset.publicId, altEn: "", altRu: "" }])
        }
      />
      <ul className="space-y-3">
        {images.map((image, index) => (
          <li key={image.publicId} className="rounded-2xl bg-greige p-4 text-sm ring-1 ring-mocha/[0.06]">
            <p className="font-medium">{image.publicId}</p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <Input
                aria-label="Alt text English"
                placeholder="Alt (EN)"
                value={image.altEn}
                onChange={(event) =>
                  setImages((current) =>
                    current.map((item, i) => (i === index ? { ...item, altEn: event.target.value } : item)),
                  )
                }
              />
              <Input
                aria-label="Alt text Russian"
                placeholder="Alt (RU)"
                value={image.altRu}
                onChange={(event) =>
                  setImages((current) =>
                    current.map((item, i) => (i === index ? { ...item, altRu: event.target.value } : item)),
                  )
                }
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() => detachImage(image.publicId)}
            >
              Detach
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FieldErrors({ errors }: { errors: Record<string, string[]> }) {
  const lines = Object.entries(errors).flatMap(([key, messages]) => messages.map((message) => `${key}: ${message}`));
  if (!lines.length) return null;
  return (
    <ul className="text-sm text-error" role="alert">
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}
