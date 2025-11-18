import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";

// Mesmos dados de exemplo da Index
const businesses = [
  {
    id: 1,
    name: "Restaurante Sabor Brasileiro",
    category: "Restaurante",
    description: "Culinária brasileira autêntica com ambiente acolhedor e pratos tradicionais.",
    address: "Rua das Flores, 123, Centro",
    phone: "(11) 98765-4321",
    email: "contato@saborbr.com.br",
    website: "www.saborbr.com.br",
    rating: 5,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
  },
  {
    id: 2,
    name: "Tech Solutions",
    category: "Tecnologia",
    description: "Desenvolvimento de software e soluções em TI para empresas de todos os portes.",
    address: "Av. Paulista, 1000, Sala 201",
    phone: "(11) 3456-7890",
    email: "contato@techsolutions.com",
    website: "www.techsolutions.com",
    rating: 5,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
  },
  {
    id: 3,
    name: "Academia Fitness Pro",
    category: "Saúde",
    description: "Academia completa com personal trainers qualificados e equipamentos modernos.",
    address: "Rua dos Esportes, 456, Jardins",
    phone: "(11) 97654-3210",
    email: "info@fitnesspro.com.br",
    website: "www.fitnesspro.com.br",
    rating: 4,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
  },
  {
    id: 4,
    name: "Café Central",
    category: "Cafeteria",
    description: "Cafés especiais, bolos artesanais e ambiente perfeito para trabalhar ou relaxar.",
    address: "Praça da República, 78",
    phone: "(11) 96543-2109",
    email: "contato@cafecentral.com.br",
    website: "www.cafecentral.com.br",
    rating: 5,
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80"
  },
  {
    id: 5,
    name: "Clínica Saúde Mais",
    category: "Saúde",
    description: "Atendimento médico de qualidade com diversas especialidades e exames.",
    address: "Av. Brasil, 2000, Vila Nova",
    phone: "(11) 3210-9876",
    email: "agendamento@saudemais.com.br",
    website: "www.saudemais.com.br",
    rating: 4,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80"
  },
  {
    id: 6,
    name: "Pet Shop Amigo Fiel",
    category: "Pet Shop",
    description: "Tudo para seu pet: banho, tosa, consultas veterinárias e produtos de qualidade.",
    address: "Rua dos Animais, 321, Morumbi",
    phone: "(11) 95432-1098",
    email: "contato@amigofiel.com.br",
    website: "www.amigofiel.com.br",
    rating: 5,
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80"
  }
];

const BusinessDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const business = businesses.find((b) => b.id === Number(id));

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

  const handleEmail = () => {
    window.location.href = `mailto:${business.email}`;
  };

  const handleWebsite = () => {
    window.open(`https://${business.website}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
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
                onClick={handleEmail}
                size="lg"
                variant="outline"
                className="gap-2"
              >
                <Mail className="w-5 h-5" />
                Enviar E-mail
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
      </main>
    </div>
  );
};

export default BusinessDetails;
