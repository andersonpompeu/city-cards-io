import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
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

// Mesmos dados de exemplo da Index com campos estendidos
const businesses: Business[] = [
  {
    id: 1,
    name: "Eletricista Maringá",
    category: "Eletricista",
    description: "Serviços elétricos residenciais e comerciais. Instalações, manutenções e reparos elétricos com segurança e qualidade.",
    address: "Av. Brasil, 2271",
    phone: "+5544999998163",
    whatsapp: "+5544999998163",
    verified: true,
    facebook: "https://facebook.com/eletricistamaringa",
    instagram: "https://instagram.com/eletricistamaringa",
    email: "contato@eletricistamaringa.com.br",
    website: "www.eletricistamaringa.com.br",
    rating: 5,
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80",
    streetAddress: "Av. Brasil, 2271",
    addressLocality: "Maringá",
    addressRegion: "PR",
    postalCode: "87013-000",
    addressCountry: "BR",
    latitude: "-23.4227011",
    longitude: "-51.9244674",
    priceRange: "R$ 80-150",
    openingHours: ["Monday-Friday 08:00-18:00", "Saturday 08:00-12:00"],
    foundingDate: "2020",
    reviewCount: 42,
    areaServedRadius: "20000"
  },
  {
    id: 2,
    name: "Restaurante Sabor Brasileiro",
    category: "Restaurante",
    description: "Culinária brasileira autêntica com ambiente acolhedor e pratos tradicionais. Almoço executivo e pratos à la carte.",
    address: "Rua das Flores, 123, Centro",
    phone: "+5544987654321",
    email: "contato@saborbr.com.br",
    website: "www.saborbr.com.br",
    rating: 5,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    streetAddress: "Rua das Flores, 123",
    addressLocality: "Maringá",
    addressRegion: "PR",
    postalCode: "87014-100",
    addressCountry: "BR",
    latitude: "-23.4205",
    longitude: "-51.9335",
    priceRange: "R$ 50-100",
    openingHours: ["Monday-Saturday 11:00-15:00", "Monday-Saturday 18:00-23:00"],
    foundingDate: "2015",
    reviewCount: 128,
    areaServedRadius: "15000"
  },
  {
    id: 3,
    name: "Tech Solutions",
    category: "Tecnologia",
    description: "Desenvolvimento de software e soluções em TI para empresas de todos os portes. Consultoria e suporte técnico especializado.",
    address: "Av. Cerro Azul, 1000, Sala 201",
    phone: "+5544934567890",
    email: "contato@techsolutions.com",
    website: "www.techsolutions.com",
    rating: 5,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    streetAddress: "Av. Cerro Azul, 1000, Sala 201",
    addressLocality: "Maringá",
    addressRegion: "PR",
    postalCode: "87015-200",
    addressCountry: "BR",
    latitude: "-23.4183",
    longitude: "-51.9280",
    priceRange: "R$ 150-500",
    openingHours: ["Monday-Friday 09:00-18:00"],
    foundingDate: "2018",
    reviewCount: 67,
    areaServedRadius: "50000"
  },
  {
    id: 4,
    name: "Academia Fitness Pro",
    category: "Academia",
    description: "Academia completa com personal trainers qualificados e equipamentos modernos. Aulas de crossfit, spinning e pilates.",
    address: "Rua dos Esportes, 456",
    phone: "+5544976543210",
    email: "info@fitnesspro.com.br",
    website: "www.fitnesspro.com.br",
    rating: 4,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    streetAddress: "Rua dos Esportes, 456",
    addressLocality: "Maringá",
    addressRegion: "PR",
    postalCode: "87016-300",
    addressCountry: "BR",
    latitude: "-23.4168",
    longitude: "-51.9312",
    priceRange: "R$ 99-199",
    openingHours: ["Monday-Friday 06:00-22:00", "Saturday 08:00-14:00"],
    foundingDate: "2017",
    reviewCount: 245,
    areaServedRadius: "10000"
  },
  {
    id: 5,
    name: "Café Central",
    category: "Cafeteria",
    description: "Cafés especiais, bolos artesanais e ambiente perfeito para trabalhar ou relaxar. Wi-Fi gratuito e tomadas em todas as mesas.",
    address: "Praça da República, 78",
    phone: "+5544965432109",
    email: "contato@cafecentral.com.br",
    website: "www.cafecentral.com.br",
    rating: 5,
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
    streetAddress: "Praça da República, 78",
    addressLocality: "Maringá",
    addressRegion: "PR",
    postalCode: "87013-100",
    addressCountry: "BR",
    latitude: "-23.4253",
    longitude: "-51.9371",
    priceRange: "R$ 10-40",
    openingHours: ["Monday-Friday 07:00-20:00", "Saturday-Sunday 08:00-18:00"],
    foundingDate: "2019",
    reviewCount: 156,
    areaServedRadius: "8000"
  },
  {
    id: 6,
    name: "Clínica Saúde Mais",
    category: "Clínica",
    description: "Atendimento médico de qualidade com diversas especialidades e exames. Clínico geral, pediatria, cardiologia e mais.",
    address: "Av. Duque de Caxias, 2000",
    phone: "+5544932109876",
    email: "agendamento@saudemais.com.br",
    website: "www.saudemais.com.br",
    rating: 4,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    streetAddress: "Av. Duque de Caxias, 2000",
    addressLocality: "Maringá",
    addressRegion: "PR",
    postalCode: "87020-025",
    addressCountry: "BR",
    latitude: "-23.4298",
    longitude: "-51.9402",
    priceRange: "R$ 100-300",
    openingHours: ["Monday-Friday 07:00-19:00", "Saturday 08:00-12:00"],
    foundingDate: "2010",
    reviewCount: 412,
    areaServedRadius: "25000"
  },
  {
    id: 7,
    name: "Pet Shop Amigo Fiel",
    category: "Pet Shop",
    description: "Tudo para seu pet: banho, tosa, consultas veterinárias e produtos de qualidade. Ração, acessórios e medicamentos.",
    address: "Rua dos Animais, 321",
    phone: "+5544954321098",
    email: "contato@amigofiel.com.br",
    website: "www.amigofiel.com.br",
    rating: 5,
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
    streetAddress: "Rua dos Animais, 321",
    addressLocality: "Maringá",
    addressRegion: "PR",
    postalCode: "87017-400",
    addressCountry: "BR",
    latitude: "-23.4142",
    longitude: "-51.9215",
    priceRange: "R$ 30-200",
    openingHours: ["Monday-Friday 08:00-18:00", "Saturday 08:00-13:00"],
    foundingDate: "2016",
    reviewCount: 189,
    areaServedRadius: "12000"
  }
];

const BusinessDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  
  // For now, use mock data - in production, fetch from Supabase by slug
  const business = businesses.find((b) => 
    (b as any).slug === slug || b.id === Number(slug)
  );

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
    window.location.href = `tel:${business.phone}`;
  };

  const handleWhatsApp = () => {
    const whatsappNumber = business.whatsapp || business.phone;
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  const handleWebsite = () => {
    window.open(`https://${business.website}`, "_blank");
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

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">E-mail</h3>
                  <p className="text-muted-foreground">{business.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <Globe className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Website</h3>
                  <p className="text-muted-foreground">{business.website}</p>
                </div>
              </div>

              {(business.facebook || business.instagram) && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                  <div className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div className="w-full">
                    <h3 className="font-semibold text-foreground mb-3">Redes Sociais</h3>
                    <div className="flex gap-3">
                      {business.facebook && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(business.facebook, '_blank')}
                          className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-950"
                        >
                          <Facebook className="w-5 h-5" />
                        </Button>
                      )}
                      {business.instagram && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(business.instagram, '_blank')}
                          className="hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300 dark:hover:bg-pink-950"
                        >
                          <Instagram className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
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
              <Button
                onClick={handleWebsite}
                size="lg"
                variant="outline"
                className="gap-2"
              >
                <Globe className="w-5 h-5" />
                Visitar Site
              </Button>
            </div>
          </div>
        </Card>

        {/* Seção de Avaliações */}
        <div className="mt-8 space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Avaliações</h2>
          
          {user ? (
            <ReviewForm
              businessId={String(business.id)}
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
            businessId={String(business.id)}
            refreshTrigger={reviewRefresh}
          />
        </div>
      </main>
    </div>
    </>
  );
};

export default BusinessDetails;
