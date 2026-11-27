"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Category = "rooms" | "events" | "restaurant" | "general";

export function MediaUploader({
  category,
  onUploaded,
}: {
  category: Category;
  onUploaded?: (asset: { publicId: string; secureUrl: string }) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function upload() {
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      const signRes = await fetch("/api/admin/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, resourceType: "image" }),
      });
      const signed = await signRes.json();
      if (!signed.ok) throw new Error(signed.error?.message ?? "Could not start upload.");
      if (file.size > signed.data.maxBytes) {
        throw new Error("File is larger than 8 MB.");
      }

      const body = new FormData();
      body.append("file", file);
      body.append("api_key", signed.data.apiKey);
      body.append("timestamp", String(signed.data.timestamp));
      body.append("signature", signed.data.signature);
      body.append("folder", signed.data.folder);
      body.append("allowed_formats", signed.data.allowedFormats);

      const cloudBody = await new Promise<{ public_id?: string; error?: { message?: string } }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${signed.data.cloudName}/image/upload`);
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100));
        };
        xhr.onload = () => {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error("Upload response was not valid."));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed. Check your connection and retry."));
        xhr.send(body);
      });
      if (!cloudBody.public_id) {
        throw new Error(cloudBody.error?.message ?? "Cloudinary rejected the file.");
      }

      const complete = await fetch("/api/admin/uploads/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: cloudBody.public_id,
          resourceType: "image",
          category,
        }),
      });
      const verified = await complete.json();
      if (!verified.ok) throw new Error(verified.error?.message ?? "Server could not verify the upload.");
      toast.success("Image verified");
      onUploaded?.({ publicId: verified.data.publicId, secureUrl: verified.data.secureUrl });
      setFile(null);
      setPreview(verified.data.secureUrl);
      setProgress(null);
    } catch (err) {
      setProgress(null);
      const message = err instanceof Error ? err.message : "Upload failed.";
      setError(message);
      toast.error(message);
    }
  }

  return (
    <div className="space-y-4 rounded-[1.4rem] bg-greige p-5 ring-1 ring-mocha/[0.06] sm:p-6">
      <Label htmlFor={`file-${category}`}>Upload image</Label>
      <Input
        id={`file-${category}`}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={(event) => {
          const next = event.target.files?.[0] ?? null;
          setFile(next);
          setPreview(next ? URL.createObjectURL(next) : null);
          setError(null);
        }}
      />
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="h-40 w-full rounded-xl object-cover" />
      ) : null}
      {progress != null ? <p className="text-sm text-mocha/75">Uploading… {progress}%</p> : null}
      {error ? (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2">
        <Button type="button" onClick={upload} disabled={!file || progress != null}>
          Upload
        </Button>
        {error ? (
          <Button type="button" variant="secondary" onClick={upload} disabled={!file}>
            Retry
          </Button>
        ) : null}
      </div>
    </div>
  );
}
