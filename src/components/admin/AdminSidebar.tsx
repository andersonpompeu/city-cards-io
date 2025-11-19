import { NavLink } from "@/components/NavLink";
import { 
  LayoutDashboard, 
  Building2, 
  FolderTree, 
  Users, 
  Settings,
  Megaphone,
  Search
} from "lucide-react";

export const AdminSidebar = () => {
  const menuItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/empresas", icon: Building2, label: "Empresas" },
    { to: "/admin/anuncios", icon: Megaphone, label: "Anúncios" },
    { to: "/admin/categorias", icon: FolderTree, label: "Categorias" },
    { to: "/admin/usuarios", icon: Users, label: "Usuários" },
    { to: "/admin/seo", icon: Search, label: "SEO" },
    { to: "/admin/configuracoes", icon: Settings, label: "Configurações" },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">
          Admin Panel
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
