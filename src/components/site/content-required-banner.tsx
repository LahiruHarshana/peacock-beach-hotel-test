import { Badge } from "@/components/ui/badge";

export function UnpublishedNotice({ label }: { label: string }) {
  return (
    <Badge variant="warning" className="mb-4">
      {label}
    </Badge>
  );
}
