import { useState } from "react";
import { BusinessCard, Business } from "@/components/BusinessCard";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Plus, Building2, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WebsiteSchemaMarkup } from "@/components/WebsiteSchemaMarkup";
import { useBusinessesWithHighlight } from "@/hooks/useBusinessesWithHighlight";

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  // Buscar empresas reais do Supabase com destaques
  const { data: businesses = [], isLoading } = useBusinessesWithHighlight();
  
  const categories = Array.from(new Set(businesses.map(b => b.category)));
  
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = 
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      business.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
      business.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      business.address.toLowerCase().includes(searchTerm.toLowerCase());
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
        {isLoading ? (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
            <p className="text-muted-foreground">Carregando empresas...</p>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhuma empresa encontrada
            </h3>
            <p className="text-muted-foreground">
              Tente buscar por outro termo ou categoria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map(business => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
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