import type { Locale } from "@/lib/validation/schemas";

export type EnquirySettings = {
  whatsappE164: string | null;
  telegramUrl: string | null;
};

export function enquiryMessage(input: {
  locale: Locale;
  roomTitle?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  if (input.locale === "ru") {
    return `Здравствуйте! Меня интересует проживание в Peacock Beach Hotel${
      input.roomTitle ? ` (${input.roomTitle})` : ""
    }. Заезд: ${input.checkIn}, выезд: ${input.checkOut}, гостей: ${input.guests}. Пожалуйста, подтвердите доступность и цену.`;
  }
  return `Hello! I would like to enquire about a stay at Peacock Beach Hotel${
    input.roomTitle ? ` (${input.roomTitle})` : ""
  }. Check-in: ${input.checkIn}, check-out: ${input.checkOut}, guests: ${input.guests}. Please confirm availability and rates.`;
}

export function composeEnquiry(
  settings: EnquirySettings,
  input: {
    locale: Locale;
    checkIn: string;
    checkOut: string;
    guests: number;
    channel: "whatsapp" | "telegram";
    roomTitle?: string;
  },
) {
  const message = enquiryMessage(input);
  if (input.channel === "whatsapp") {
    if (!settings.whatsappE164) {
      return { channel: "whatsapp" as const, url: null, message, copyFallback: true, configured: false };
    }
    const digits = settings.whatsappE164.replace(/\D/g, "");
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
    return { channel: "whatsapp" as const, url, message, copyFallback: true, configured: true };
  }
  if (!settings.telegramUrl) {
    return { channel: "telegram" as const, url: null, message, copyFallback: true, configured: false };
  }
  const base = settings.telegramUrl;
  const supportsPrefill = base.startsWith("https://t.me/") && !base.includes("joinchat");
  const url = supportsPrefill ? `${base}${base.includes("?") ? "&" : "?"}text=${encodeURIComponent(message)}` : base;
  return { channel: "telegram" as const, url, message, copyFallback: !supportsPrefill, configured: true };
}
