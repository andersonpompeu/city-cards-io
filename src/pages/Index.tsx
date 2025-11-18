import { useState } from "react";
import { BusinessCard, Business } from "@/components/BusinessCard";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dados de exemplo
const initialBusinesses: Business[] = [
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

const Index = () => {
  const navigate = useNavigate();
  const [businesses] = useState<Business[]>(initialBusinesses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categories = Array.from(new Set(businesses.map((b) => b.category)));

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todos" || business.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-10 h-10" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Diretório Local</h1>
                <p className="text-sm md:text-base text-primary-foreground/90">
                  Encontre as melhores empresas da sua região
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/cadastrar")}
              size="lg"
              variant="secondary"
              className="hidden md:flex gap-2"
            >
              <Plus className="w-5 h-5" />
              Cadastrar Empresa
            </Button>
          </div>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </header>

      {/* Filtros */}
      <div className="container mx-auto px-4 py-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Lista de Empresas */}
      <main className="container mx-auto px-4 pb-12">
        {filteredBusinesses.length === 0 ? (
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
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </main>

      {/* Botão Flutuante Mobile */}
      <Button
        onClick={() => navigate("/cadastrar")}
        size="lg"
        className="fixed bottom-6 right-6 md:hidden rounded-full shadow-card-hover w-14 h-14 p-0"
      >
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
  );
};

export default Index;
