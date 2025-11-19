import { BusinessLayout } from "@/components/business/BusinessLayout";
import { StatCard } from "@/components/admin/StatCard";
import { Eye, Phone, Mail, MessageCircle, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Statistics() {
  // Mock data for charts
  const viewsData = [
    { date: "01/11", views: 12 },
    { date: "08/11", views: 19 },
    { date: "15/11", views: 15 },
    { date: "22/11", views: 25 },
    { date: "29/11", views: 22 },
  ];

  const actionsData = [
    { name: "Telefone", value: 45 },
    { name: "WhatsApp", value: 78 },
    { name: "Email", value: 23 },
    { name: "Website", value: 34 },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Estatísticas</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho da sua empresa</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Visualizações" value={369} icon={Eye} />
          <StatCard title="Telefone" value={45} icon={Phone} />
          <StatCard title="Email" value={23} icon={Mail} />
          <StatCard title="WhatsApp" value={78} icon={MessageCircle} variant="success" />
          <StatCard title="Website" value={34} icon={Globe} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Visualizações do Perfil (Últimos 30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={actionsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {actionsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Avaliações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-16">{star} estrelas</span>
                  <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 10}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {star === 5 ? 14 : star === 4 ? 4 : 2}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </BusinessLayout>
  );
}
