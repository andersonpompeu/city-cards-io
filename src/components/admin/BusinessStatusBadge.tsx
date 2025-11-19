import { Badge } from "@/components/ui/badge";

interface BusinessStatusBadgeProps {
  status: string;
}

export const BusinessStatusBadge = ({ status }: BusinessStatusBadgeProps) => {
  const variants = {
    pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400" },
    approved: { label: "Aprovada", className: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400" },
    rejected: { label: "Rejeitada", className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400" },
    inactive: { label: "Inativa", className: "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400" },
  };

  const variant = variants[status as keyof typeof variants] || variants.pending;

  return (
    <Badge className={variant.className} variant="secondary">
      {variant.label}
    </Badge>
  );
};
