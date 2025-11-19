import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useHighlights } from "@/hooks/useHighlights";
import { HighlightLevelBadge } from "@/components/admin/HighlightLevelBadge";
import { HighlightStatusBadge } from "@/components/admin/HighlightStatusBadge";
import { StatCard } from "@/components/admin/StatCard";
import { Plus, MoreVertical, Edit, Trash2, CheckCircle, XCircle, Pause, Play, Pin, Search, AlertCircle, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function HighlightsList() {
  const { highlights, isLoading, deleteHighlight, approveRequest, rejectRequest, updateHighlight } = useHighlights();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const stats = useMemo(() => {
    if (!highlights) return { active: 0, pending: 0, expired: 0 };
    return {
      active: highlights.filter(h => h.status === 'ativo').length,
      pending: highlights.filter(h => h.status === 'aguardando_aprovacao').length,
      expired: highlights.filter(h => h.status === 'expirado').length,
    };
  }, [highlights]);

  const filteredHighlights = useMemo(() => {
    if (!highlights) return [];
    
    return highlights.filter((highlight) => {
      const matchesSearch = highlight.businesses?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || highlight.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [highlights, searchTerm, statusFilter]);

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteHighlight(deleteId);
      setDeleteId(null);
    }
  };

  const handleApprove = (id: string) => {
    approveRequest({ id });
  };

  const handleReject = (id: string) => {
    setRejectId(id);
  };

  const confirmReject = () => {
    if (rejectId && rejectReason.trim()) {
      rejectRequest({ id: rejectId, reason: rejectReason });
      setRejectId(null);
      setRejectReason("");
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ativo' ? 'pausado' : 'ativo';
    updateHighlight({ id, status: newStatus });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Anúncios e Destaques</h1>
          <p className="text-muted-foreground">Gerencie os destaques das empresas</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Ativos"
            value={stats.active}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Aguardando Aprovação"
            value={stats.pending}
            icon={AlertCircle}
            variant="warning"
          />
          <StatCard
            title="Expirados (30 dias)"
            value={stats.expired}
            icon={Clock}
            variant="default"
          />
        </div>

        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Anúncio
            </Button>
          </div>

          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">
                Todos
              </TabsTrigger>
              <TabsTrigger value="ativo">
                Ativos {stats.active > 0 && <Badge variant="secondary" className="ml-2">{stats.active}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="aguardando_aprovacao">
                Pendentes {stats.pending > 0 && <Badge variant="secondary" className="ml-2">{stats.pending}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="expirado">Expirados</TabsTrigger>
              <TabsTrigger value="pausado">Pausados</TabsTrigger>
            </TabsList>

            <TabsContent value={statusFilter} className="mt-6">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Carregando...
                </div>
              ) : filteredHighlights.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum anúncio encontrado
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ordem</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHighlights.map((highlight) => (
                      <TableRow key={highlight.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {highlight.businesses?.image && (
                              <img
                                src={highlight.businesses.image}
                                alt={highlight.businesses.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">{highlight.businesses?.name}</div>
                              <div className="text-sm text-muted-foreground">{highlight.businesses?.category}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <HighlightLevelBadge level={highlight.level} />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{format(new Date(highlight.start_date), 'dd/MM/yyyy', { locale: ptBR })}</div>
                            <div className="text-muted-foreground">até {format(new Date(highlight.end_date), 'dd/MM/yyyy', { locale: ptBR })}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <HighlightStatusBadge status={highlight.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {highlight.pin_to_top && <Pin className="h-4 w-4 text-primary" />}
                            <span>{highlight.manual_order || 'Auto'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              
                              {highlight.status === 'aguardando_aprovacao' && (
                                <>
                                  <DropdownMenuItem onClick={() => handleApprove(highlight.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Aprovar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleReject(highlight.id)}>
                                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                    Rejeitar
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              {(highlight.status === 'ativo' || highlight.status === 'pausado') && (
                                <DropdownMenuItem onClick={() => handleToggleStatus(highlight.id, highlight.status)}>
                                  {highlight.status === 'ativo' ? (
                                    <>
                                      <Pause className="mr-2 h-4 w-4" />
                                      Pausar
                                    </>
                                  ) : (
                                    <>
                                      <Play className="mr-2 h-4 w-4" />
                                      Ativar
                                    </>
                                  )}
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem
                                onClick={() => handleDelete(highlight.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!rejectId} onOpenChange={() => setRejectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeitar Solicitação</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor, informe o motivo da rejeição:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="Motivo da rejeição..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectReason("")}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmReject}
              disabled={!rejectReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Rejeitar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
