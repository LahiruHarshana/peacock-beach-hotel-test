import Image from "next/image";
import { cloudinaryImageUrl } from "@/lib/media/cloudinary";

type FramedImageProps = {
  publicId?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
};

/** Fixed 3:2 frame so a real photograph replaces the empty slot without moving the page. */
export function FramedImage({ publicId, alt, sizes, priority = false }: FramedImageProps) {
  let src: string | null = null;
  if (publicId) {
    try {
      src = cloudinaryImageUrl(publicId, 1200);
    } catch {
      src = null;
    }
  }

  return (
    <div className="relative aspect-[3/2] overflow-hidden bg-stone">
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : null}
    </div>
  );
}
