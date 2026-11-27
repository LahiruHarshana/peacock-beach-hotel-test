import "@/app/globals.css";
import { Cormorant_Garamond, DM_Sans, Instrument_Serif, Manrope } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import type { ChildrenProps } from "@/types/page-props";

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
});

const cyrillic = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-cyrillic",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: ChildrenProps) {
  return (
    <html lang="en" className={`${serif.variable} ${cyrillic.variable} ${sans.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full bg-ivory font-sans text-mocha antialiased">
        <SessionProvider>
          {children}
          <Toaster richColors position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}
