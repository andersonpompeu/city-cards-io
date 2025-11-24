import { Building2, MapPin, Phone, Star, MessageCircle, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Highlight } from "@/types/highlight";
import { HighlightBadge } from "@/components/HighlightBadge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
export interface Business {
  id: number | string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email?: string | null;
  website?: string | null;
  rating: number | null;
  image: string;
  verified?: boolean;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  slug?: string | null;
  meta_description?: string | null;
  keywords?: string[] | null;
  neighborhood?: string | null;
  long_description?: string | null;
  // Extended fields for Schema.org SEO
  streetAddress?: string | null;
  addressLocality?: string | null;
  addressRegion?: string | null;
  postalCode?: string | null;
  addressCountry?: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  priceRange?: string | null;
  openingHours?: string[] | null;
  foundingDate?: string | null;
  reviewCount?: number;
  areaServedRadius?: string;
}
interface BusinessCardProps {
  business: Business;
  highlight?: Highlight | null;
}
export const BusinessCard = ({
  business,
  highlight
}: BusinessCardProps) => {
  const navigate = useNavigate();
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!business.verified) {
      toast.info("Este perfil ainda não foi verificado");
      return;
    }
    const whatsappNumber = business.whatsapp || business.phone;
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}`;
    window.open(whatsappUrl, '_blank');
  };
  const handleViewProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use slug if available, otherwise fall back to id
    const identifier = (business as any).slug || business.id;
    navigate(`/empresa/${identifier}`);
  };
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-accent text-accent" : "fill-muted text-muted"}`} />);
  };
  // Use slug if available, otherwise fall back to id
  const identifier = (business as any).slug || business.id;
  
  return <Card onClick={() => navigate(`/empresa/${identifier}`)} className={cn("overflow-hidden cursor-pointer transition-all duration-300 group bg-gradient-card border-border", highlight && "ring-2 ring-offset-2 shadow-xl hover:scale-[1.02]", !highlight && "hover:shadow-card-hover")} style={highlight ? {
    borderColor: highlight.border_color
  } : undefined}>
      <div className="relative h-48 overflow-hidden bg-muted">
        <img src={business.image} alt={business.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        {highlight && <div className="absolute top-3 left-3 z-10">
            <HighlightBadge level={highlight.level} color={highlight.badge_color} />
          </div>}
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
          {business.category}
        </Badge>
      </div>
      
      <div className="p-5" style={highlight ? {
      background: `linear-gradient(to bottom, ${highlight.border_color}10, transparent)`
    } : undefined}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-1">
              {business.name}
            </h3>
            <div className="flex items-center gap-1 mb-2">
              {renderStars(business.rating)}
              <span className="text-sm text-muted-foreground ml-2">
                ({business.rating}.0)
              </span>
            </div>
          </div>
          <Building2 className="w-6 h-6 text-muted-foreground" />
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {business.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="truncate">{business.address}</span>
          </div>
          
        </div>

        <div className="flex gap-2 pt-3 border-t border-border">
          <Button variant="outline" size="sm" onClick={handleWhatsAppClick} disabled={!business.verified} className={cn("flex-1 gap-2", business.verified ? "hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-950 dark:hover:text-green-400" : "opacity-50 cursor-not-allowed")}>
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
          <Button variant="default" size="sm" onClick={handleViewProfileClick} className="flex-1 gap-2">
            <Eye className="w-4 h-4" />
            Ver Perfil
          </Button>
        </div>
      </div>
    </Card>;
};