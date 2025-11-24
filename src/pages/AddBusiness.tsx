import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddBusiness = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    facebook: "",
    instagram: "",
    image: "",
  });

  const categories = [
    "Restaurante",
    "Tecnologia",
    "Saúde",
    "Cafeteria",
    "Pet Shop",
    "Educação",
    "Serviços",
    "Comércio",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.category || !formData.phone) {
      toast.error("Por favor, preencha os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      // Inserir empresa no banco
      const { data, error } = await supabase
        .from("businesses")
        .insert({
          id: crypto.randomUUID(),
          name: formData.name,
          category: formData.category,
          description: formData.description,
          address: formData.address,
          phone: formData.phone,
          email: formData.email || null,
          website: formData.website || null,
          image: formData.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
          owner_id: user?.id || null,
          status: 'pending',
          address_locality: 'Maringá',
          address_region: 'PR',
          rating: 0
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Empresa cadastrada com sucesso! Aguarde aprovação.");
      
      // Redirecionar para dashboard se autenticado, senão para home
      if (user) {
        navigate("/empresa/dashboard");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.error('Erro ao cadastrar empresa:', error);
      toast.error("Erro ao cadastrar empresa: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            <h1 className="text-3xl md:text-4xl font-bold">Cadastrar Nova Empresa</h1>
          </div>
        </div>
      </header>

      {/* Formulário */}
      <main className="container mx-auto px-4 py-8">
        <Card className="p-6 md:p-8 shadow-card bg-gradient-card max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-semibold">
                Nome da Empresa *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ex: Restaurante Sabor Brasileiro"
                required
                className="border-2 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground font-semibold">
                Categoria *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger className="border-2 focus:border-primary">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground font-semibold">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Descreva os produtos/serviços oferecidos..."
                rows={4}
                className="border-2 focus:border-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-semibold">
                  Telefone *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="(44) 98765-4321"
                  required
                  className="border-2 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-foreground font-semibold">
                  WhatsApp
                </Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  placeholder="(44) 98765-4321"
                  className="border-2 focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-semibold">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="contato@empresa.com.br"
                  className="border-2 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-foreground font-semibold">
                  Website
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="www.empresa.com.br"
                  className="border-2 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-foreground font-semibold">
                Endereço
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Rua, número, bairro"
                className="border-2 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-foreground font-semibold">
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  value={formData.facebook}
                  onChange={(e) => handleChange("facebook", e.target.value)}
                  placeholder="https://facebook.com/suaempresa"
                  className="border-2 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-foreground font-semibold">
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                  placeholder="https://instagram.com/suaempresa"
                  className="border-2 focus:border-primary"
                />
              </div>
            </div>

            <ImageUpload
              onUploadComplete={(url) => handleChange("image", url)}
              currentImage={formData.image}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1 gap-2"
                disabled={loading}
              >
                <Save className="w-5 h-5" />
                {loading ? "Cadastrando..." : "Cadastrar Empresa"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default AddBusiness;
