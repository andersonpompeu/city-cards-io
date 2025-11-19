import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const AdminHeader = () => {
  const { user, signOut } = useAdminAuth();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="text-sm text-muted-foreground">
        Bem-vindo, <span className="font-medium text-foreground">{user?.email}</span>
      </div>
      
      <Button variant="ghost" size="sm" onClick={signOut}>
        <LogOut className="h-4 w-4 mr-2" />
        Sair
      </Button>
    </header>
  );
};
