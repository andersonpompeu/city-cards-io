import { Flame, Star, Sparkles } from "lucide-react";

interface HighlightBadgeProps {
  level: 'premium' | 'alto' | 'padrao';
  color: string;
}

export const HighlightBadge = ({ level, color }: HighlightBadgeProps) => {
  const icons = {
    premium: Flame,
    alto: Star,
    padrao: Sparkles,
  };
  
  const Icon = icons[level];
  
  return (
    <div 
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-white font-bold text-sm shadow-lg"
      style={{ backgroundColor: color }}
    >
      <Icon className="w-4 h-4" />
      <span>DESTAQUE</span>
    </div>
  );
};
