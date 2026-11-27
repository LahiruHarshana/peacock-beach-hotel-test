import { siteSettingsUpdateSchema } from "@/lib/validation/schemas";
import { isSelectablePublicId } from "@/lib/media/policy";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { getSiteSettings, updateSiteSettings } from "@/server/repositories/site-settings";
import { writeAuditLog } from "@/server/audit/write-audit-log";

export async function GET() {
  const requestId = getRequestId();
  try {
    await requireAdminPermission("users:manage");
    const settings = await getSiteSettings();
    return jsonSuccess(
      {
        brandName: settings.brandName,
        metaDescription: settings.metaDescription,
        whatsappE164: settings.whatsappE164,
        telegramUrl: settings.telegramUrl,
        address: settings.address,
        mapUrl: settings.mapUrl,
        aboutBody: settings.aboutBody,
        restaurantIntro: settings.restaurantIntro,
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
      },
      requestId,
    );
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}

export async function PUT(req: Request) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("users:manage", req);
    const parsed = siteSettingsUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError(
        "VALIDATION_ERROR",
        "Please review the highlighted fields.",
        requestId,
        422,
        parsed.error.flatten().fieldErrors as Record<string, string[]>,
      );
    }
    const imageIds = [
      parsed.data.heroImagePublicId,
      parsed.data.storyImagePublicId,
      parsed.data.socialImagePublicId,
      parsed.data.restaurantImagePublicId,
      parsed.data.galleryRoomsImagePublicId,
      parsed.data.galleryRestaurantImagePublicId,
      parsed.data.galleryEventsImagePublicId,
      parsed.data.galleryAboutImagePublicId,
      parsed.data.reviewsImagePublicId,
      parsed.data.closerImagePublicId,
    ];
    if (imageIds.some((publicId) => publicId && !isSelectablePublicId(publicId))) {
      return jsonError(
        "FORBIDDEN",
        "An image is outside the active media namespace.",
        requestId,
        403,
      );
    }
    await updateSiteSettings(parsed.data);
    await writeAuditLog({
      actorId: user.id,
      action: "settings.update",
      targetType: "site_settings",
      targetId: "main",
      requestId,
      summary: "Updated public contact settings",
    });
    return jsonSuccess({ saved: true }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
