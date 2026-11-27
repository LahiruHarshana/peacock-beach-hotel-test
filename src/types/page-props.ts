import type { ReactNode } from "react";

export type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export type LocaleSlugPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export type ChildrenProps = {
  children: ReactNode;
};
