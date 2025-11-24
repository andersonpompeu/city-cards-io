import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessLayout } from "@/components/business/BusinessLayout";
import { useBusinessAuth } from "@/hooks/useBusinessAuth";
import { useBusinessAnalytics } from "@/hooks/useBusinessAnalytics";
import { StatCard } from "@/components/admin/StatCard";
import { Eye, Phone, MessageCircle, Globe, Star, MessageSquare, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BusinessStatusBadge } from "@/components/admin/BusinessStatusBadge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function BusinessDashboard() {
  const { business } = useBusinessAuth();
  const navigate = useNavigate();

  const { data: businessData } = useQuery({
    queryKey: ["business-full-data", business?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", business?.id)
        .single();
      
      return data;
    },
    enabled: !!business?.id,
  });

  const { data: reviewsCount } = useQuery({
    queryKey: ["business-reviews-count", business?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("business_id", business?.id);
      
      return count || 0;
    },
    enabled: !!business?.id,
  });

  // Buscar analytics reais
  const { data: analytics } = useBusinessAnalytics(business?.id || "");

  // Mock data for chart
  const chartData = [
    { day: "Seg", views: 45 },
    { day: "Ter", views: 52 },
    { day: "Qua", views: 61 },
    { day: "Qui", views: 58 },
    { day: "Sex", views: 70 },
    { day: "Sáb", views: 48 },
    { day: "Dom", views: 35 },
  ];

  const getStatusAlert = () => {
    if (!businessData) return null;

    switch (businessData.status) {
      case "pending":
        return (
          <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              Seu cadastro está sendo analisado pela nossa equipe. Você será notificado quando for aprovado.
            </AlertDescription>
          </Alert>
        );
      case "rejected":
        return (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              Seu cadastro foi rejeitado. {businessData.rejection_reason && `Motivo: ${businessData.rejection_reason}`}
            </AlertDescription>
          </Alert>
        );
      case "approved":
        return (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Parabéns! Sua empresa está aprovada e visível na plataforma.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-muted-foreground">Status:</span>
              <BusinessStatusBadge status={businessData?.status || "pending"} />
            </div>
          </div>
        </div>

        {getStatusAlert()}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Visualizações do Perfil"
            value={analytics?.views || 0}
            icon={Eye}
          />
          <StatCard
            title="Cliques no Telefone"
            value={analytics?.phone_clicks || 0}
            icon={Phone}
          />
          <StatCard
            title="Cliques no WhatsApp"
            value={analytics?.whatsapp_clicks || 0}
            icon={MessageCircle}
          />
          <StatCard
            title="Cliques no Website"
            value={analytics?.website_clicks || 0}
            icon={Globe}
          />
          <StatCard
            title="Nota Média"
            value={businessData?.rating || 0}
            icon={Star}
            variant="success"
          />
          <StatCard
            title="Total de Avaliações"
            value={reviewsCount || 0}
            icon={MessageSquare}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Visualizações da Última Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Atalhos Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/empresa/perfil")}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/empresa/avaliacoes")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ver Avaliações
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(`/empresa/${business?.id}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver no Site
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </BusinessLayout>
  );
}
