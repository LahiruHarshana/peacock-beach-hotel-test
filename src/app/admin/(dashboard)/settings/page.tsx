import { redirect } from "next/navigation";
import { AdminPage } from "@/components/admin/admin-page";
import { SettingsForm } from "@/components/admin/settings-form";
import { roleHasPermission } from "@/lib/auth/roles";
import { getAdminSessionUser } from "@/lib/auth/session";
import { cloudinaryImageUrl } from "@/lib/media/cloudinary";
import { listMediaAssets } from "@/server/repositories/media";
import { getSiteSettings } from "@/server/repositories/site-settings";

export default async function AdminSettingsPage() {
  const user = await getAdminSessionUser();
  if (!user || !roleHasPermission(user.role, "users:manage")) redirect("/admin");
  const settings = await getSiteSettings();
  const assets = await listMediaAssets().catch(() => []);
  const library = assets.flatMap((asset) => {
    const publicId = String(asset.publicId);
    try {
      return [{ publicId, url: cloudinaryImageUrl(publicId, 400) }];
    } catch {
      return [];
    }
  });

  return (
    <AdminPage
      title="Settings"
      lede="Approved names, descriptions, and contacts are stored here. Empty or placeholder values stay off the public pages. A missing contact shows a copy-message fallback and does not confirm a booking."
    >
      <SettingsForm
        initial={{
          brandNameEn: settings.brandName.en,
          brandNameRu: settings.brandName.ru,
          metaDescriptionEn: settings.metaDescription.en,
          metaDescriptionRu: settings.metaDescription.ru,
          whatsappE164: settings.whatsappE164,
          telegramUrl: settings.telegramUrl,
          addressEn: settings.address.en,
          addressRu: settings.address.ru,
          mapUrl: settings.mapUrl,
          aboutBodyEn: settings.aboutBody.en,
          aboutBodyRu: settings.aboutBody.ru,
          restaurantIntroEn: settings.restaurantIntro.en,
          restaurantIntroRu: settings.restaurantIntro.ru,
          heroImagePublicId: settings.heroImagePublicId,
          homeHeroTheme: settings.homeHeroTheme,
          storyImagePublicId: settings.storyImagePublicId,
          socialImagePublicId: settings.socialImagePublicId,
          restaurantImagePublicId: settings.restaurantImagePublicId,
          galleryRoomsImagePublicId: settings.galleryRoomsImagePublicId,
          galleryRestaurantImagePublicId: settings.galleryRestaurantImagePublicId,
          galleryEventsImagePublicId: settings.galleryEventsImagePublicId,
          galleryAboutImagePublicId: settings.galleryAboutImagePublicId,
          reviewsImagePublicId: settings.reviewsImagePublicId,
          closerImagePublicId: settings.closerImagePublicId,
        }}
        library={library}
      />
    </AdminPage>
  );
}
