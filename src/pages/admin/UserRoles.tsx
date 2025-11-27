import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, UserPlus, UserMinus, Shield, Building2, User as UserIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserRole {
  user_id: string;
  role: "admin" | "business_owner" | "user";
  email?: string;
}

interface UserWithRoles {
  id: string;
  email: string;
  roles: ("admin" | "business_owner" | "user")[];
}

export default function UserRoles() {
  const [filterRole, setFilterRole] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string; role: "admin" | "business_owner" | "user" } | null>(null);
  const [actionType, setActionType] = useState<"add" | "remove" | null>(null);
  const queryClient = useQueryClient();

  // Fetch all users with their roles
  const { data: users, isLoading } = useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      // Get all users from auth
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Get all roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Map users with their roles
      const usersWithRoles: UserWithRoles[] = authUsers.map(user => {
        const userRoles = rolesData
          .filter(r => r.user_id === user.id)
          .map(r => r.role as "admin" | "business_owner" | "user");

        return {
          id: user.id,
          email: user.email || "Sem email",
          roles: userRoles,
        };
      });

      return usersWithRoles;
    },
  });

  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "business_owner" | "user" }) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast.success("Role adicionado com sucesso!");
      setSelectedUser(null);
      setActionType(null);
    },
    onError: (error: any) => {
      toast.error("Erro ao adicionar role: " + error.message);
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "business_owner" | "user" }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast.success("Role removido com sucesso!");
      setSelectedUser(null);
      setActionType(null);
    },
    onError: (error: any) => {
      toast.error("Erro ao remover role: " + error.message);
    },
  });

  const handleAddRole = (userId: string, email: string, role: "admin" | "business_owner" | "user") => {
    setSelectedUser({ id: userId, email, role });
    setActionType("add");
  };

  const handleRemoveRole = (userId: string, email: string, role: "admin" | "business_owner" | "user") => {
    setSelectedUser({ id: userId, email, role });
    setActionType("remove");
  };

  const confirmAction = () => {
    if (!selectedUser) return;

    if (actionType === "add") {
      addRoleMutation.mutate({ userId: selectedUser.id, role: selectedUser.role });
    } else if (actionType === "remove") {
      removeRoleMutation.mutate({ userId: selectedUser.id, role: selectedUser.role });
    }
  };

  const getRoleBadge = (role: string) => {
    const config = {
      admin: { icon: Shield, variant: "destructive" as const, label: "Admin" },
      business_owner: { icon: Building2, variant: "default" as const, label: "Empresa" },
      user: { icon: UserIcon, variant: "secondary" as const, label: "Usuário" },
    };

    const roleConfig = config[role as keyof typeof config] || config.user;
    const Icon = roleConfig.icon;

    return (
      <Badge variant={roleConfig.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {roleConfig.label}
      </Badge>
    );
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: "Admin",
      business_owner: "Proprietário de Empresa",
      user: "Usuário",
    };
    return labels[role as keyof typeof labels] || role;
  };

  const filteredUsers = users?.filter(user => {
    if (filterRole === "all") return true;
    return user.roles.includes(filterRole as any);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Roles de Usuários</h1>
          <p className="text-muted-foreground">
            Adicione ou remova permissões de acesso aos usuários da plataforma
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Usuários e Permissões</CardTitle>
                <CardDescription>
                  Total de {users?.length || 0} usuários cadastrados
                </CardDescription>
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os usuários</SelectItem>
                  <SelectItem value="admin">Apenas Admins</SelectItem>
                  <SelectItem value="business_owner">Apenas Empresas</SelectItem>
                  <SelectItem value="user">Apenas Usuários</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers?.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground">{user.id}</p>
                      <div className="flex gap-2 mt-2">
                        {user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <div key={role} className="flex items-center gap-2">
                              {getRoleBadge(role)}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveRole(user.id, user.email, role)}
                                className="h-6 w-6 p-0"
                              >
                                <UserMinus className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <Badge variant="outline">Sem permissões</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!user.roles.includes("admin") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddRole(user.id, user.email, "admin")}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Admin
                        </Button>
                      )}
                      {!user.roles.includes("business_owner") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddRole(user.id, user.email, "business_owner")}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Empresa
                        </Button>
                      )}
                      {!user.roles.includes("user") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddRole(user.id, user.email, "user")}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Usuário
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {filteredUsers?.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado com esse filtro
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={!!selectedUser && !!actionType} onOpenChange={(open) => {
          if (!open) {
            setSelectedUser(null);
            setActionType(null);
          }
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionType === "add" ? "Adicionar" : "Remover"} Role
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionType === "add" ? (
                  <>
                    Você está prestes a adicionar o role <strong>{getRoleLabel(selectedUser?.role || "")}</strong> ao usuário{" "}
                    <strong>{selectedUser?.email}</strong>.
                  </>
                ) : (
                  <>
                    Você está prestes a remover o role <strong>{getRoleLabel(selectedUser?.role || "")}</strong> do usuário{" "}
                    <strong>{selectedUser?.email}</strong>.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmAction}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
