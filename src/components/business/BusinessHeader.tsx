import { useBusinessAuth } from "@/hooks/useBusinessAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const BusinessHeader = () => {
  const { business, signOut } = useBusinessAuth();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{business?.name}</span>
      </div>
      
      <Button variant="ghost" size="sm" onClick={signOut}>
        <LogOut className="h-4 w-4 mr-2" />
        Sair
      </Button>
    </header>
  );
};
