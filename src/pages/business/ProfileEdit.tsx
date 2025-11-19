import { BusinessLayout } from "@/components/business/BusinessLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function ProfileEdit() {
  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Editar Perfil</h1>
          <p className="text-muted-foreground">Atualize as informações da sua empresa</p>
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
              O formulário de edição de perfil estará disponível em breve.
              Você poderá atualizar informações como nome, endereço, telefone, horários de funcionamento e muito mais.
            </p>
          </CardContent>
        </Card>
      </div>
    </BusinessLayout>
  );
}
