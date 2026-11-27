import type { ChildrenProps } from "@/types/page-props";

export default function SiteTemplate({ children }: ChildrenProps) {
  return <div data-route-enter>{children}</div>;
}