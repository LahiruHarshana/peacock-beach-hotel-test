"use client";

import { useState } from "react";
import { MediaUploader } from "@/components/admin/media-uploader";

type Asset = { publicId: string; secureUrl: string };

export function MediaLibrary({ initial }: { initial: Asset[] }) {
  const [assets, setAssets] = useState(initial);

  return (
    <div className="space-y-6">
      <MediaUploader
        category="general"
        onUploaded={(asset) => setAssets((current) => [asset, ...current.filter((item) => item.publicId !== asset.publicId)])}
      />
      {assets.length === 0 ? (
        <p className="text-sm text-mocha/75">No verified media assets yet.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-3">
          {assets.map((asset) => (
            <li key={asset.publicId} className="overflow-hidden rounded-2xl bg-greige text-sm ring-1 ring-mocha/[0.06]">
              {asset.secureUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset.secureUrl} alt="" className="h-44 w-full object-cover" />
              ) : null}
              <p className="break-all p-4 text-xs leading-5 text-mocha/75">{asset.publicId}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
