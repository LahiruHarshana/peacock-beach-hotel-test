import "@/app/globals.css";
import { DM_Sans } from "next/font/google";
import type { ChildrenProps } from "@/types/page-props";

const sans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm",
});

export default function ApiDocsLayout({ children }: ChildrenProps) {
  return (
    <html lang="en" className={`${sans.variable} h-full`}>
      <body className="min-h-full bg-ivory font-sans text-mocha antialiased">{children}</body>
    </html>
  );
}
