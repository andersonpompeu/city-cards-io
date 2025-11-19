import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
}

export const StatCard = ({ title, value, icon: Icon, variant = "default" }: StatCardProps) => {
  const variants = {
    default: "text-primary bg-primary/10",
    success: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950",
    warning: "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950",
    danger: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-2 text-foreground">{value}</h3>
          </div>
          <div className={cn("p-3 rounded-lg", variants[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
