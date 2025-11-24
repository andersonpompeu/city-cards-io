import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Building2,
  LogOut,
  MessageCircle,
  Facebook,
  Instagram,
} from "lucide-react";
import { SchemaMarkup } from "@/components/SchemaMarkup";
import { Business } from "@/components/BusinessCard";
import { AuthDialog } from "@/components/AuthDialog";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewsList } from "@/components/ReviewsList";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const BusinessDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  
  // Buscar empresa real do Supabase
  const { data: business, isLoading } = useQuery({
    queryKey: ['business', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'approved')
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Registrar visualização
  useEffect(() => {
    if (business?.id) {
      // Registrar analytics
      supabase
        .from('business_analytics')
        .insert({
          business_id: business.id,
          event_type: 'view'
        })
        .then(() => console.log('View tracked'));
    }
  }, [business?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Empresa não encontrada
          </h2>
          <Button onClick={() => navigate("/")}>Voltar para início</Button>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 ${
          i < rating ? "fill-accent text-accent" : "fill-muted text-muted"
        }`}
      />
    ));
  };

  const handleCall = () => {
    // Registrar analytics
    supabase
      .from('business_analytics')
      .insert({
        business_id: business.id,
        event_type: 'phone_click'
      })
      .then(() => console.log('Phone click tracked'));
    
    window.location.href = `tel:${business.phone}`;
  };

  const handleWhatsApp = () => {
    // Registrar analytics
    supabase
      .from('business_analytics')
      .insert({
        business_id: business.id,
        event_type: 'whatsapp_click'
      })
      .then(() => console.log('WhatsApp click tracked'));
    
    const whatsappNumber = business.phone;
    const cleanNumber = whatsappNumber?.replace(/\D/g, '') || '';
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  const handleWebsite = () => {
    // Registrar analytics
    supabase
      .from('business_analytics')
      .insert({
        business_id: business.id,
        event_type: 'website_click'
      })
      .then(() => console.log('Website click tracked'));
    
    window.open(`https://${business.website}`, "_blank");
  };

  const handleEmail = () => {
    // Registrar analytics
    supabase
      .from('business_analytics')
      .insert({
        business_id: business.id,
        event_type: 'email_click'
      })
      .then(() => console.log('Email click tracked'));
    
    window.location.href = `mailto:${business.email}`;
  };

  return (
    <>
      <SchemaMarkup business={business} baseUrl="https://seusite.com" />
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onSuccess={() => setReviewRefresh((prev) => prev + 1)}
      />
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            {user ? (
              <Button
                variant="ghost"
                onClick={signOut}
                className="hover:bg-primary-foreground/10 gap-2"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setAuthDialogOpen(true)}
                className="hover:bg-primary-foreground/10"
              >
                Entrar
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Detalhes da Empresa</h1>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden shadow-card-hover bg-gradient-card">
          {/* Imagem */}
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img
              src={business.image}
              alt={business.name}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground text-lg px-4 py-2">
              {business.category}
            </Badge>
          </div>

          {/* Informações */}
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {business.name}
              </h2>
              <div className="flex items-center gap-2 mb-4">
                {renderStars(business.rating)}
                <span className="text-lg text-muted-foreground ml-2">
                  ({business.rating}.0)
                </span>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {business.description}
              </p>
            </div>

            {/* Informações de Contato */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Endereço</h3>
                  <p className="text-muted-foreground">{business.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Telefone</h3>
                  <p className="text-muted-foreground">{business.phone}</p>
                </div>
              </div>

              {business.email && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleEmail}>
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">E-mail</h3>
                    <p className="text-muted-foreground">{business.email}</p>
                  </div>
                </div>
              )}

              {business.website && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                  <Globe className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Website</h3>
                    <p className="text-muted-foreground">{business.website}</p>
                  </div>
                </div>
              )}

            </div>

            {/* Botões de Ação */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleCall}
                size="lg"
                className="gap-2 bg-secondary hover:bg-secondary/90"
              >
                <Phone className="w-5 h-5" />
                Ligar
              </Button>
              <Button
                onClick={handleWhatsApp}
                size="lg"
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </Button>
              {business.website && (
                <Button
                  onClick={handleWebsite}
                  size="lg"
                  variant="outline"
                  className="gap-2"
                >
                  <Globe className="w-5 h-5" />
                  Visitar Site
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Seção de Avaliações */}
        <div className="mt-8 space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Avaliações</h2>
          
          {user ? (
            <ReviewForm
              businessId={business.id}
              onSuccess={() => setReviewRefresh((prev) => prev + 1)}
            />
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Faça login para deixar sua avaliação
              </p>
              <Button onClick={() => setAuthDialogOpen(true)}>
                Entrar ou Criar Conta
              </Button>
            </Card>
          )}

          <ReviewsList
            businessId={business.id}
            refreshTrigger={reviewRefresh}
          />
        </div>
      </main>
    </div>
    </>
  );
};

export default BusinessDetails;
