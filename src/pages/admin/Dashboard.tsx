import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { Building2, CheckCircle, Clock, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BusinessStatusBadge } from "@/components/admin/BusinessStatusBadge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [total, approved, pending, reviews] = await Promise.all([
        supabase.from("businesses").select("*", { count: "exact", head: true }),
        supabase.from("businesses").select("*", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("businesses").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("reviews").select("*", { count: "exact", head: true }),
      ]);

      return {
        total: total.count || 0,
        approved: approved.count || 0,
        pending: pending.count || 0,
        reviews: reviews.count || 0,
      };
    },
  });

  const { data: recentBusinesses } = useQuery({
    queryKey: ["recent-businesses"],
    queryFn: async () => {
      const { data } = await supabase
        .from("businesses")
        .select("id, name, category, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      
      return data || [];
    },
  });

  // Mock data for chart
  const chartData = [
    { day: "Seg", views: 120 },
    { day: "Ter", views: 150 },
    { day: "Qua", views: 180 },
    { day: "Qui", views: 160 },
    { day: "Sex", views: 200 },
    { day: "Sáb", views: 140 },
    { day: "Dom", views: 100 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total de Empresas"
            value={stats?.total || 0}
            icon={Building2}
          />
          <StatCard
            title="Empresas Aprovadas"
            value={stats?.approved || 0}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Aguardando Aprovação"
            value={stats?.pending || 0}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Total de Avaliações"
            value={stats?.reviews || 0}
            icon={Star}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acessos da Última Semana</CardTitle>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Últimas Empresas Cadastradas</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/empresas")}>
              Ver Todas
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBusinesses?.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell className="font-medium">{business.name}</TableCell>
                    <TableCell>{business.category}</TableCell>
                    <TableCell>
                      <BusinessStatusBadge status={business.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(business.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
