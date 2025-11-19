import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function BusinessForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    street_address: "",
    address_locality: "Maringá",
    address_region: "PR",
    postal_code: "",
    latitude: "",
    longitude: "",
    price_range: "",
    founding_date: "",
    status: "pending" as string,
  });

  // Load business data if editing
  const { data: business } = useQuery({
    queryKey: ["business", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", id)
        .single();
      return data;
    },
    enabled: isEdit,
  });

  // Load categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      return data || [];
    },
  });

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || "",
        category: business.category || "",
        description: business.description || "",
        phone: business.phone || "",
        email: business.email || "",
        website: business.website || "",
        address: business.address || "",
        street_address: business.street_address || "",
        address_locality: business.address_locality || "Maringá",
        address_region: business.address_region || "PR",
        postal_code: business.postal_code || "",
        latitude: business.latitude?.toString() || "",
        longitude: business.longitude?.toString() || "",
        price_range: business.price_range || "",
        founding_date: business.founding_date || "",
        status: business.status || "pending",
      });
    }
  }, [business]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEdit) {
        const { error } = await supabase
          .from("businesses")
          .update(data)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("businesses")
          .insert([{ ...data, id: crypto.randomUUID() }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-businesses"] });
      toast.success(isEdit ? "Empresa atualizada!" : "Empresa criada!");
      navigate("/admin/empresas");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao salvar empresa");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSave = {
      ...formData,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
    };

    saveMutation.mutate(dataToSave);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/empresas")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEdit ? "Editar Empresa" : "Nova Empresa"}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? "Atualize as informações da empresa" : "Cadastre uma nova empresa na plataforma"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria*</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição*</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone*</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(44) 99999-9999"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://exemplo.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo*</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Rua, número - Bairro"
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="postal_code">CEP</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    placeholder="87000-000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_locality">Cidade</Label>
                  <Input
                    id="address_locality"
                    value={formData.address_locality}
                    onChange={(e) => setFormData({ ...formData, address_locality: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_region">Estado</Label>
                  <Input
                    id="address_region"
                    value={formData.address_region}
                    onChange={(e) => setFormData({ ...formData, address_region: e.target.value })}
                    maxLength={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status e Outros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="approved">Aprovada</SelectItem>
                      <SelectItem value="rejected">Rejeitada</SelectItem>
                      <SelectItem value="inactive">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_range">Faixa de Preço</Label>
                  <Input
                    id="price_range"
                    value={formData.price_range}
                    onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                    placeholder="R$ 50-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Salvando..." : isEdit ? "Atualizar" : "Criar Empresa"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/admin/empresas")}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
