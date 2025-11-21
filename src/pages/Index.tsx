import { useState } from "react";
import { BusinessCard, Business } from "@/components/BusinessCard";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Plus, Building2, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WebsiteSchemaMarkup } from "@/components/WebsiteSchemaMarkup";

// Dados de exemplo com campos estendidos para Schema.org
const initialBusinesses: Business[] = [{
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
}, {
  id: 2,
  name: "Restaurante Sabor Brasileiro",
  category: "Restaurante",
  description: "Culinária brasileira autêntica com ambiente acolhedor e pratos tradicionais. Almoço executivo e pratos à la carte.",
  address: "Rua das Flores, 123, Centro",
  phone: "+5544987654321",
  whatsapp: "+5544987654321",
  verified: true,
  facebook: "https://facebook.com/saborbr",
  instagram: "https://instagram.com/saborbr",
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
}, {
  id: 3,
  name: "Tech Solutions",
  category: "Tecnologia",
  description: "Desenvolvimento de software e soluções em TI para empresas de todos os portes. Consultoria e suporte técnico especializado.",
  address: "Av. Cerro Azul, 1000, Sala 201",
  phone: "+5544934567890",
  whatsapp: "+5544934567890",
  verified: true,
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
}, {
  id: 4,
  name: "Academia Fitness Pro",
  category: "Academia",
  description: "Academia completa com personal trainers qualificados e equipamentos modernos. Aulas de crossfit, spinning e pilates.",
  address: "Rua dos Esportes, 456",
  phone: "+5544976543210",
  verified: false,
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
}, {
  id: 5,
  name: "Café Central",
  category: "Cafeteria",
  description: "Cafés especiais, bolos artesanais e ambiente perfeito para trabalhar ou relaxar. Wi-Fi gratuito e tomadas em todas as mesas.",
  address: "Praça da República, 78",
  phone: "+5544965432109",
  verified: false,
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
}, {
  id: 6,
  name: "Clínica Saúde Mais",
  category: "Clínica",
  description: "Atendimento médico de qualidade com diversas especialidades e exames. Clínico geral, pediatria, cardiologia e mais.",
  address: "Av. Duque de Caxias, 2000",
  phone: "+5544932109876",
  whatsapp: "+5544932109876",
  verified: true,
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
}, {
  id: 7,
  name: "Pet Shop Amigo Fiel",
  category: "Pet Shop",
  description: "Tudo para seu pet: banho, tosa, consultas veterinárias e produtos de qualidade. Ração, acessórios e medicamentos.",
  address: "Rua dos Animais, 321",
  phone: "+5544954321098",
  verified: false,
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
}];
const Index = () => {
  const navigate = useNavigate();
  const [businesses] = useState<Business[]>(initialBusinesses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const categories = Array.from(new Set(businesses.map(b => b.category)));
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) || business.category.toLowerCase().includes(searchTerm.toLowerCase()) || business.description.toLowerCase().includes(searchTerm.toLowerCase()) || business.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  return <>
      <WebsiteSchemaMarkup baseUrl="https://seusite.com" siteName="Diretório de Empresas Locais - Maringá" description="Encontre empresas e serviços locais de qualidade em Maringá e região. Busque por categorias e localize negócios próximos a você." />
      <div className="min-h-screen bg-background">
      
      {/* Top Navigation Bar */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              <span className="font-semibold text-lg">Guia Comercial</span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/empresa/login')}>
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
              <Button variant="default" size="sm" onClick={() => navigate('/adicionar')}>
                <UserPlus className="w-4 h-4 mr-2" />
                Cadastrar Empresa
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 px-[500px]">
            <div className="flex items-center gap-3">
              <Building2 className="w-10 h-10" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Diretório Local</h1>
                <p className="text-sm md:text-base text-primary-foreground/90">
                  Encontre as melhores empresas da sua região
                </p>
              </div>
            </div>
            <div className="hidden md:flex gap-3 shadow-md">
              <Button onClick={() => navigate("/faq")} size="lg" variant="outline" className="font-serif">
                FAQ
              </Button>
            </div>
          </div>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </header>

      {/* Filtros */}
      <div className="container mx-auto px-4 py-8">
        <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      </div>

      {/* Lista de Empresas */}
      <main className="container mx-auto px-4 pb-12">
        {filteredBusinesses.length === 0 ? <div className="text-center py-16">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhuma empresa encontrada
            </h3>
            <p className="text-muted-foreground">
              Tente buscar por outro termo ou categoria
            </p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map(business => <BusinessCard key={business.id} business={business} />)}
          </div>}
      </main>

      {/* Botão Flutuante Mobile */}
      <Button onClick={() => navigate("/cadastrar")} size="lg" className="fixed bottom-6 right-6 md:hidden rounded-full shadow-card-hover w-14 h-14 p-0">
        <Plus className="w-6 h-6" />
      </Button>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Diretório Local. Conectando você com os melhores negócios da região.
          </p>
        </div>
      </footer>
    </div>
    </>;
};
export default Index;