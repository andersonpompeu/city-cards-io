import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Search,
  FileText,
  Image as ImageIcon,
  MapPin,
  Download,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AuditIssue {
  severity: "critical" | "warning" | "info";
  category: string;
  message: string;
  field: string;
}

interface BusinessAudit {
  id: string;
  name: string;
  slug: string | null;
  issues: AuditIssue[];
  score: number;
}

interface AuditStats {
  total: number;
  withIssues: number;
  critical: number;
  warnings: number;
  info: number;
  averageScore: number;
}

export default function SeoAudit() {
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [businesses, setBusinesses] = useState<BusinessAudit[]>([]);
  const [stats, setStats] = useState<AuditStats>({
    total: 0,
    withIssues: 0,
    critical: 0,
    warnings: 0,
    info: 0,
    averageScore: 0,
  });

  useEffect(() => {
    runAudit();
  }, []);

  const runAudit = async () => {
    setAuditing(true);
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select("id, name, slug, description, meta_description, keywords, image, address, neighborhood, street_address, address_locality, address_region, postal_code, long_description, email, phone, website")
        .eq("status", "approved");

      if (error) throw error;

      const audited: BusinessAudit[] = data.map((business) => {
        const issues: AuditIssue[] = [];
        let score = 100;

        // Verificar slug
        if (!business.slug) {
          issues.push({
            severity: "critical",
            category: "URL",
            message: "Slug não configurado",
            field: "slug",
          });
          score -= 15;
        }

        // Verificar meta description
        if (!business.meta_description) {
          issues.push({
            severity: "critical",
            category: "Meta Tags",
            message: "Meta description ausente",
            field: "meta_description",
          });
          score -= 15;
        } else if (business.meta_description.length < 120) {
          issues.push({
            severity: "warning",
            category: "Meta Tags",
            message: `Meta description muito curta (${business.meta_description.length}/160 caracteres)`,
            field: "meta_description",
          });
          score -= 5;
        } else if (business.meta_description.length > 160) {
          issues.push({
            severity: "warning",
            category: "Meta Tags",
            message: `Meta description muito longa (${business.meta_description.length}/160 caracteres)`,
            field: "meta_description",
          });
          score -= 5;
        }

        // Verificar keywords
        if (!business.keywords || business.keywords.length === 0) {
          issues.push({
            severity: "warning",
            category: "Palavras-chave",
            message: "Palavras-chave não configuradas",
            field: "keywords",
          });
          score -= 10;
        }

        // Verificar descrição longa
        if (!business.long_description) {
          issues.push({
            severity: "warning",
            category: "Conteúdo",
            message: "Descrição longa ausente (recomendado: 400+ palavras)",
            field: "long_description",
          });
          score -= 10;
        } else {
          const wordCount = business.long_description.split(/\s+/).length;
          if (wordCount < 400) {
            issues.push({
              severity: "info",
              category: "Conteúdo",
              message: `Descrição longa muito curta (${wordCount}/400 palavras)`,
              field: "long_description",
            });
            score -= 5;
          }
        }

        // Verificar endereço estruturado
        if (!business.street_address || !business.address_locality || !business.postal_code) {
          issues.push({
            severity: "warning",
            category: "Local SEO",
            message: "Endereço estruturado incompleto",
            field: "address",
          });
          score -= 10;
        }

        // Verificar bairro
        if (!business.neighborhood) {
          issues.push({
            severity: "info",
            category: "Local SEO",
            message: "Bairro não informado",
            field: "neighborhood",
          });
          score -= 5;
        }

        // Verificar imagem
        if (!business.image || business.image === "/placeholder.svg") {
          issues.push({
            severity: "critical",
            category: "Imagens",
            message: "Imagem principal ausente ou placeholder",
            field: "image",
          });
          score -= 15;
        }

        // Verificar contato
        if (!business.email && !business.phone) {
          issues.push({
            severity: "warning",
            category: "Contato",
            message: "Nenhuma forma de contato configurada",
            field: "contact",
          });
          score -= 10;
        }

        // Verificar website
        if (!business.website) {
          issues.push({
            severity: "info",
            category: "Links",
            message: "Website não informado",
            field: "website",
          });
          score -= 5;
        }

        return {
          id: business.id,
          name: business.name,
          slug: business.slug,
          issues,
          score: Math.max(0, score),
        };
      });

      // Calcular estatísticas
      const totalIssues = audited.reduce((acc, b) => acc + b.issues.length, 0);
      const critical = audited.reduce(
        (acc, b) => acc + b.issues.filter((i) => i.severity === "critical").length,
        0
      );
      const warnings = audited.reduce(
        (acc, b) => acc + b.issues.filter((i) => i.severity === "warning").length,
        0
      );
      const info = audited.reduce(
        (acc, b) => acc + b.issues.filter((i) => i.severity === "info").length,
        0
      );

      setStats({
        total: audited.length,
        withIssues: audited.filter((b) => b.issues.length > 0).length,
        critical,
        warnings,
        info,
        averageScore: audited.reduce((acc, b) => acc + b.score, 0) / audited.length,
      });

      setBusinesses(audited.sort((a, b) => a.score - b.score));
      toast.success("Auditoria concluída!");
    } catch (error) {
      console.error("Erro na auditoria:", error);
      toast.error("Erro ao executar auditoria");
    } finally {
      setLoading(false);
      setAuditing(false);
    }
  };

  const exportReport = () => {
    const report = businesses.map((b) => ({
      empresa: b.name,
      slug: b.slug || "N/A",
      pontuacao: b.score,
      problemas_criticos: b.issues.filter((i) => i.severity === "critical").length,
      avisos: b.issues.filter((i) => i.severity === "warning").length,
      informacoes: b.issues.filter((i) => i.severity === "info").length,
      detalhes: b.issues.map((i) => `${i.category}: ${i.message}`).join("; "),
    }));

    const csv = [
      ["Empresa", "Slug", "Pontuação", "Críticos", "Avisos", "Informações", "Detalhes"],
      ...report.map((r) => [
        r.empresa,
        r.slug,
        r.pontuacao,
        r.problemas_criticos,
        r.avisos,
        r.informacoes,
        r.detalhes,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditoria-seo-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-destructive";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Executando auditoria SEO...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Auditoria SEO</h1>
            <p className="text-muted-foreground">
              Análise automática de otimização para mecanismos de busca
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={runAudit} disabled={auditing} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${auditing ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontuação Média</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
                {stats.averageScore.toFixed(0)}%
              </div>
              <Progress value={stats.averageScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas com Problemas</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.withIssues}/{stats.total}
              </div>
              <p className="text-xs text-muted-foreground">
                {((stats.withIssues / stats.total) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Problemas Críticos</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.critical}</div>
              <p className="text-xs text-muted-foreground">Requerem ação imediata</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avisos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
              <p className="text-xs text-muted-foreground">Melhorias recomendadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Resumo Geral */}
        {stats.critical > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ação Necessária</AlertTitle>
            <AlertDescription>
              Foram encontrados {stats.critical} problemas críticos que precisam ser corrigidos
              para melhorar a visibilidade nos mecanismos de busca.
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs de Análise */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              Todas ({businesses.length})
            </TabsTrigger>
            <TabsTrigger value="critical">
              Crítico ({businesses.filter((b) => b.issues.some((i) => i.severity === "critical")).length})
            </TabsTrigger>
            <TabsTrigger value="warning">
              Avisos ({businesses.filter((b) => b.issues.some((i) => i.severity === "warning")).length})
            </TabsTrigger>
            <TabsTrigger value="good">
              Bom (≥80) ({businesses.filter((b) => b.score >= 80).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {businesses.map((business) => (
              <Card key={business.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {business.name}
                        {business.score >= 80 && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        {business.slug ? `/empresa/${business.slug}` : "Sem slug configurado"}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(business.score)}`}>
                        {business.score}
                      </div>
                      <p className="text-xs text-muted-foreground">Pontuação SEO</p>
                    </div>
                  </div>
                </CardHeader>
                {business.issues.length > 0 && (
                  <CardContent>
                    <div className="space-y-2">
                      {business.issues.map((issue, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-muted">
                          {getSeverityIcon(issue.severity)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                                {issue.category}
                              </Badge>
                            </div>
                            <p className="text-sm">{issue.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Campo: {issue.field}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="critical" className="space-y-4">
            {businesses
              .filter((b) => b.issues.some((i) => i.severity === "critical"))
              .map((business) => (
                <Card key={business.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle>{business.name}</CardTitle>
                        <CardDescription>
                          {business.slug ? `/empresa/${business.slug}` : "Sem slug configurado"}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(business.score)}`}>
                          {business.score}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {business.issues
                        .filter((i) => i.severity === "critical")
                        .map((issue, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-muted">
                            {getSeverityIcon(issue.severity)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                                  {issue.category}
                                </Badge>
                              </div>
                              <p className="text-sm">{issue.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Campo: {issue.field}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="warning" className="space-y-4">
            {businesses
              .filter((b) => b.issues.some((i) => i.severity === "warning"))
              .map((business) => (
                <Card key={business.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle>{business.name}</CardTitle>
                        <CardDescription>
                          {business.slug ? `/empresa/${business.slug}` : "Sem slug configurado"}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(business.score)}`}>
                          {business.score}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {business.issues
                        .filter((i) => i.severity === "warning")
                        .map((issue, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-muted">
                            {getSeverityIcon(issue.severity)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                                  {issue.category}
                                </Badge>
                              </div>
                              <p className="text-sm">{issue.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Campo: {issue.field}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="good" className="space-y-4">
            {businesses
              .filter((b) => b.score >= 80)
              .map((business) => (
                <Card key={business.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {business.name}
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </CardTitle>
                        <CardDescription>
                          {business.slug ? `/empresa/${business.slug}` : "Sem slug configurado"}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(business.score)}`}>
                          {business.score}
                        </div>
                        <p className="text-xs text-muted-foreground">Excelente!</p>
                      </div>
                    </div>
                  </CardHeader>
                  {business.issues.length > 0 && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        Pequenas melhorias sugeridas:
                      </p>
                      <div className="space-y-2">
                        {business.issues.map((issue, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-muted">
                            {getSeverityIcon(issue.severity)}
                            <div className="flex-1">
                              <p className="text-sm">{issue.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
