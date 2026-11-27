import { routing } from "@/i18n/routing";
import type { ChildrenProps } from "@/types/page-props";

export default function RootLayout({ children }: ChildrenProps) {
  return children;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
