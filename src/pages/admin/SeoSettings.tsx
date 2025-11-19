import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Search, Image, Globe, FileText } from "lucide-react";

export default function SeoSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    seo_site_title: "",
    seo_site_description: "",
    seo_keywords: [] as string[],
    seo_og_image: "",
    seo_robots_index: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("key, value")
        .in("key", [
          "seo_site_title",
          "seo_site_description",
          "seo_keywords",
          "seo_og_image",
          "seo_robots_index",
        ]);

      if (error) throw error;

      const settingsObj: any = {};
      data?.forEach((item) => {
        settingsObj[item.key] = item.value;
      });

      setSettings({
        seo_site_title: settingsObj.seo_site_title || "",
        seo_site_description: settingsObj.seo_site_description || "",
        seo_keywords: settingsObj.seo_keywords || [],
        seo_og_image: settingsObj.seo_og_image || "",
        seo_robots_index: settingsObj.seo_robots_index ?? true,
      });
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast.error("Erro ao carregar configurações de SEO");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("platform_settings")
          .upsert({ key: update.key, value: update.value }, { onConflict: "key" });

        if (error) throw error;
      }

      toast.success("Configurações de SEO salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações de SEO");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações de SEO</h1>
          <p className="text-muted-foreground">
            Configure as meta tags e otimizações para mecanismos de busca
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Meta Tags Globais
            </CardTitle>
            <CardDescription>
              Estas informações são usadas como padrão em todo o site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_title">Título do Site</Label>
              <Input
                id="site_title"
                value={settings.seo_site_title}
                onChange={(e) =>
                  setSettings({ ...settings, seo_site_title: e.target.value })
                }
                placeholder="Diretório de Empresas Locais - Maringá, PR"
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">
                Máximo 60 caracteres. Caracteres usados: {settings.seo_site_title.length}/60
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_description">Descrição do Site</Label>
              <Textarea
                id="site_description"
                value={settings.seo_site_description}
                onChange={(e) =>
                  setSettings({ ...settings, seo_site_description: e.target.value })
                }
                placeholder="Encontre empresas e serviços locais de qualidade..."
                maxLength={160}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Máximo 160 caracteres. Caracteres usados: {settings.seo_site_description.length}/160
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Palavras-chave (uma por linha)</Label>
              <Textarea
                id="keywords"
                value={settings.seo_keywords.join("\n")}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    seo_keywords: e.target.value.split("\n").filter((k) => k.trim()),
                  })
                }
                placeholder="diretório empresas maringá&#10;serviços locais&#10;empresas maringá"
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                Palavras-chave principais para SEO. Uma por linha.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Open Graph e Redes Sociais
            </CardTitle>
            <CardDescription>
              Configure como seu site aparece quando compartilhado em redes sociais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="og_image">URL da Imagem Open Graph</Label>
              <Input
                id="og_image"
                value={settings.seo_og_image}
                onChange={(e) =>
                  setSettings({ ...settings, seo_og_image: e.target.value })
                }
                placeholder="/placeholder.svg"
              />
              <p className="text-xs text-muted-foreground">
                Imagem padrão exibida ao compartilhar o site (1200x630px recomendado)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Indexação
            </CardTitle>
            <CardDescription>
              Controle como os mecanismos de busca indexam seu site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir Indexação</Label>
                <p className="text-sm text-muted-foreground">
                  Permite que mecanismos de busca indexem o site
                </p>
              </div>
              <Switch
                checked={settings.seo_robots_index}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, seo_robots_index: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={loadSettings} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
