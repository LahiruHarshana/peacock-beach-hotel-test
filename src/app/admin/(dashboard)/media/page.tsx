import { AdminPage } from "@/components/admin/admin-page";
import { MediaLibrary } from "@/components/admin/media-library";
import { listMediaAssets } from "@/server/repositories/media";

export default async function AdminMediaPage() {
  const assets = await listMediaAssets();

  return (
    <AdminPage
      title="Media"
      lede="Uploads are signed on the server, sent directly to Cloudinary, then verified before they can be attached to a room, event, or homepage panel."
    >
      <div>
        <MediaLibrary
          initial={assets.map((asset) => ({
            publicId: String(asset.publicId),
            secureUrl: String(asset.secureUrl ?? ""),
          }))}
        />
      </div>
    </AdminPage>
  );
}
