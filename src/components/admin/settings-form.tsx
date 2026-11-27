"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Initial = {
  brandNameEn: string;
  brandNameRu: string;
  metaDescriptionEn: string;
  metaDescriptionRu: string;
  whatsappE164: string | null;
  telegramUrl: string | null;
  addressEn: string;
  addressRu: string;
  mapUrl: string | null;
  aboutBodyEn: string;
  aboutBodyRu: string;
  restaurantIntroEn: string;
  restaurantIntroRu: string;
  heroImagePublicId: string | null;
  homeHeroTheme: "dark" | "light";
  storyImagePublicId: string | null;
  socialImagePublicId: string | null;
  restaurantImagePublicId: string | null;
  galleryRoomsImagePublicId: string | null;
  galleryRestaurantImagePublicId: string | null;
  galleryEventsImagePublicId: string | null;
  galleryAboutImagePublicId: string | null;
  reviewsImagePublicId: string | null;
  closerImagePublicId: string | null;
};

type LibraryImage = { publicId: string; url: string };

export function SettingsForm({ initial, library }: { initial: Initial; library: LibraryImage[] }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrors({});
    const form = new FormData(event.currentTarget);
    const emptyToNull = (value: FormDataEntryValue | null) => {
      const text = String(value ?? "").trim();
      return text.length ? text : null;
    };
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandName: {
          en: String(form.get("brandNameEn") ?? ""),
          ru: String(form.get("brandNameRu") ?? ""),
        },
        metaDescription: {
          en: String(form.get("metaDescriptionEn") ?? ""),
          ru: String(form.get("metaDescriptionRu") ?? ""),
        },
        whatsappE164: emptyToNull(form.get("whatsappE164")),
        telegramUrl: emptyToNull(form.get("telegramUrl")),
        mapUrl: emptyToNull(form.get("mapUrl")),
        aboutBody: {
          en: String(form.get("aboutBodyEn") ?? ""),
          ru: String(form.get("aboutBodyRu") ?? ""),
        },
        restaurantIntro: {
          en: String(form.get("restaurantIntroEn") ?? ""),
          ru: String(form.get("restaurantIntroRu") ?? ""),
        },
        heroImagePublicId: emptyToNull(form.get("heroImagePublicId")),
        homeHeroTheme: String(form.get("homeHeroTheme") ?? "light") === "dark" ? "dark" : "light",
        storyImagePublicId: emptyToNull(form.get("storyImagePublicId")),
        socialImagePublicId: emptyToNull(form.get("socialImagePublicId")),
        restaurantImagePublicId: emptyToNull(form.get("restaurantImagePublicId")),
        galleryRoomsImagePublicId: emptyToNull(form.get("galleryRoomsImagePublicId")),
        galleryRestaurantImagePublicId: emptyToNull(form.get("galleryRestaurantImagePublicId")),
        galleryEventsImagePublicId: emptyToNull(form.get("galleryEventsImagePublicId")),
        galleryAboutImagePublicId: emptyToNull(form.get("galleryAboutImagePublicId")),
        reviewsImagePublicId: emptyToNull(form.get("reviewsImagePublicId")),
        closerImagePublicId: emptyToNull(form.get("closerImagePublicId")),
        address: {
          en: String(form.get("addressEn") ?? ""),
          ru: String(form.get("addressRu") ?? ""),
        },
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.ok) {
      setErrors(json.error?.fieldErrors ?? {});
      toast.error(json.error?.message ?? "Could not save settings");
      return;
    }
    toast.success("Site settings saved");
  }

  return (
    <form onSubmit={save} className="max-w-3xl space-y-5 rounded-[1.4rem] bg-greige p-6 ring-1 ring-mocha/[0.06] sm:p-8">
      <div>
        <Label htmlFor="brandNameEn">Hotel name (EN)</Label>
        <Input id="brandNameEn" name="brandNameEn" defaultValue={initial.brandNameEn} />
      </div>
      <div>
        <Label htmlFor="brandNameRu">Hotel name (RU)</Label>
        <Input id="brandNameRu" name="brandNameRu" defaultValue={initial.brandNameRu} />
      </div>
      <div>
        <Label htmlFor="metaDescriptionEn">Homepage description (EN)</Label>
        <Textarea id="metaDescriptionEn" name="metaDescriptionEn" defaultValue={initial.metaDescriptionEn} />
      </div>
      <div>
        <Label htmlFor="metaDescriptionRu">Homepage description (RU)</Label>
        <Textarea id="metaDescriptionRu" name="metaDescriptionRu" defaultValue={initial.metaDescriptionRu} />
      </div>
      <div>
        <Label htmlFor="aboutBodyEn">About (EN)</Label>
        <Textarea id="aboutBodyEn" name="aboutBodyEn" defaultValue={initial.aboutBodyEn} />
      </div>
      <div>
        <Label htmlFor="aboutBodyRu">About (RU)</Label>
        <Textarea id="aboutBodyRu" name="aboutBodyRu" defaultValue={initial.aboutBodyRu} />
      </div>
      <div>
        <Label htmlFor="restaurantIntroEn">Restaurant (EN)</Label>
        <Textarea id="restaurantIntroEn" name="restaurantIntroEn" defaultValue={initial.restaurantIntroEn} />
      </div>
      <div>
        <Label htmlFor="restaurantIntroRu">Restaurant (RU)</Label>
        <Textarea id="restaurantIntroRu" name="restaurantIntroRu" defaultValue={initial.restaurantIntroRu} />
      </div>
      <ImagePicker name="heroImagePublicId" label="Homepage hero" images={library} defaultValue={initial.heroImagePublicId} />
      <div>
        <Label htmlFor="homeHeroTheme">Homepage hero theme</Label>
        <select
          id="homeHeroTheme"
          name="homeHeroTheme"
          defaultValue={initial.homeHeroTheme}
          className="mt-1.5 flex h-10 w-full rounded-md border border-mocha/15 bg-ivory px-3 py-2 text-sm text-mocha"
        >
          <option value="dark">Dark — charcoal field, ivory navigation over hero</option>
          <option value="light">Light — cream field, matches Halden interior sections</option>
        </select>
      </div>
      <ImagePicker name="storyImagePublicId" label="Homepage story panel" images={library} defaultValue={initial.storyImagePublicId} />
      <ImagePicker name="restaurantImagePublicId" label="Restaurant image" images={library} defaultValue={initial.restaurantImagePublicId} />
      <ImagePicker name="socialImagePublicId" label="Sharing image" images={library} defaultValue={initial.socialImagePublicId} />
      <ImagePicker name="galleryRoomsImagePublicId" label="Homepage gallery — rooms" images={library} defaultValue={initial.galleryRoomsImagePublicId} />
      <ImagePicker name="galleryRestaurantImagePublicId" label="Homepage gallery — restaurant" images={library} defaultValue={initial.galleryRestaurantImagePublicId} />
      <ImagePicker name="galleryEventsImagePublicId" label="Homepage gallery — events" images={library} defaultValue={initial.galleryEventsImagePublicId} />
      <ImagePicker name="galleryAboutImagePublicId" label="Homepage gallery — about" images={library} defaultValue={initial.galleryAboutImagePublicId} />
      <ImagePicker name="reviewsImagePublicId" label="Homepage reviews panel" images={library} defaultValue={initial.reviewsImagePublicId} />
      <ImagePicker name="closerImagePublicId" label="Homepage closing panel" images={library} defaultValue={initial.closerImagePublicId} />
      <div>
        <Label htmlFor="whatsappE164">WhatsApp (E.164)</Label>
        <Input id="whatsappE164" name="whatsappE164" placeholder="+94…" defaultValue={initial.whatsappE164 ?? ""} />
      </div>
      <div>
        <Label htmlFor="telegramUrl">Telegram URL</Label>
        <Input id="telegramUrl" name="telegramUrl" placeholder="https://t.me/…" defaultValue={initial.telegramUrl ?? ""} />
      </div>
      <div>
        <Label htmlFor="addressEn">Address (EN)</Label>
        <Textarea id="addressEn" name="addressEn" defaultValue={initial.addressEn} />
      </div>
      <div>
        <Label htmlFor="addressRu">Address (RU)</Label>
        <Textarea id="addressRu" name="addressRu" defaultValue={initial.addressRu} />
      </div>
      <div>
        <Label htmlFor="mapUrl">Map link</Label>
        <Input id="mapUrl" name="mapUrl" defaultValue={initial.mapUrl ?? ""} />
      </div>
      {Object.keys(errors).length > 0 ? (
        <ul className="text-sm text-error" role="alert">
          {Object.entries(errors).flatMap(([key, messages]) =>
            messages.map((message) => <li key={`${key}-${message}`}>{message}</li>),
          )}
        </ul>
      ) : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save settings"}
      </Button>
      <p className="text-xs leading-5 text-mocha/75">
        Leave WhatsApp, Telegram, the address, and images empty until the hotel provides them. Choose photographs from Media. Placeholder text cannot be saved.
      </p>
    </form>
  );
}

function ImagePicker({
  name,
  label,
  images,
  defaultValue,
}: {
  name: string;
  label: string;
  images: LibraryImage[];
  defaultValue: string | null;
}) {
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <fieldset>
      <legend className="text-[0.65rem] font-medium uppercase tracking-[0.14rem] text-mocha/75">{label}</legend>
      <input type="hidden" name={name} value={value} />
      {images.length === 0 ? (
        <p className="mt-2 text-sm text-mocha/75">Upload a photograph in Media before choosing one.</p>
      ) : (
        <div className="mt-2 grid grid-cols-3 gap-2">
          <button
            type="button"
            aria-pressed={value === ""}
            onClick={() => setValue("")}
            className="min-h-24 rounded-xl border border-mocha/10 px-2 text-xs text-mocha/75 aria-pressed:border-mocha aria-pressed:bg-mocha aria-pressed:text-ivory"
          >
            None
          </button>
          {images.map((image) => (
            <button
              key={image.publicId}
              type="button"
              aria-pressed={value === image.publicId}
              onClick={() => setValue(image.publicId)}
              className="overflow-hidden rounded-xl border border-mocha/10 aria-pressed:ring-2 aria-pressed:ring-mocha"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="h-24 w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </fieldset>
  );
}
