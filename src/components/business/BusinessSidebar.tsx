import { NavLink } from "@/components/NavLink";
import { 
  LayoutDashboard, 
  Building2, 
  MessageSquare, 
  BarChart3,
  Lock,
  Sparkles
} from "lucide-react";

export const BusinessSidebar = () => {
  const menuItems = [
    { to: "/empresa/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/empresa/perfil", icon: Building2, label: "Meu Perfil" },
    { to: "/empresa/destaque", icon: Sparkles, label: "Solicitar Destaque" },
    { to: "/empresa/avaliacoes", icon: MessageSquare, label: "Avaliações" },
    { to: "/empresa/estatisticas", icon: BarChart3, label: "Estatísticas" },
    { to: "/empresa/senha", icon: Lock, label: "Segurança" },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">
          Painel Empresa
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
