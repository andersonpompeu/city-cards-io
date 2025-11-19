import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function BusinessUsersList() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usuários Empresariais</h1>
          <p className="text-muted-foreground">Gerencie os proprietários de empresas</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Funcionalidade em Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              A gestão de usuários empresariais estará disponível em breve. 
              Por enquanto, os usuários podem ser criados manualmente no banco de dados.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
