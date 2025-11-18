import { Building2, MapPin, Phone, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export interface Business {
  id: number;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  image: string;
  // Extended fields for Schema.org SEO
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
  latitude?: string;
  longitude?: string;
  priceRange?: string;
  openingHours?: string[];
  foundingDate?: string;
  reviewCount?: number;
  areaServedRadius?: string;
}

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard = ({ business }: BusinessCardProps) => {
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-accent text-accent"
            : "fill-muted text-muted"
        }`}
      />
    ));
  };

  return (
    <Card
      onClick={() => navigate(`/empresa/${business.id}`)}
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-card-hover group bg-gradient-card border-border"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
          {business.category}
        </Badge>
      </div>
      
      <div className="p-5">
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

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="truncate">{business.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Phone className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{business.phone}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
