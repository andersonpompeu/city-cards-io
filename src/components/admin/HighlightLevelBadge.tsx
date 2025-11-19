import { Badge } from "@/components/ui/badge";
import { Flame, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface HighlightLevelBadgeProps {
  level: 'premium' | 'alto' | 'padrao';
  showIcon?: boolean;
}

export const HighlightLevelBadge = ({ level, showIcon = true }: HighlightLevelBadgeProps) => {
  const config = {
    premium: {
      label: 'Premium',
      icon: Flame,
      className: 'bg-yellow-500 text-yellow-50 hover:bg-yellow-600',
    },
    alto: {
      label: 'Alto',
      icon: Star,
      className: 'bg-blue-500 text-blue-50 hover:bg-blue-600',
    },
    padrao: {
      label: 'Padrão',
      icon: Sparkles,
      className: 'bg-green-500 text-green-50 hover:bg-green-600',
    },
  };
  
  const { label, icon: Icon, className } = config[level];
  
  return (
    <Badge className={cn(className, "gap-1")}>
      {showIcon && <Icon className="w-3 h-3" />}
      {label}
    </Badge>
  );
};
