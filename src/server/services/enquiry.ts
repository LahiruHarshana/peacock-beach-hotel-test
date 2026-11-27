import "server-only";
import { getSiteSettings } from "@/server/repositories/site-settings";
import { composeEnquiry } from "@/server/services/enquiry-message";
import type { Locale } from "@/lib/validation/schemas";

export async function buildEnquiryHandoff(input: {
  locale: Locale;
  checkIn: string;
  checkOut: string;
  guests: number;
  channel: "whatsapp" | "telegram";
  roomTitle?: string;
}) {
  const settings = await getSiteSettings();
  return composeEnquiry(settings, input);
}
