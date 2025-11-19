import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NewHighlight, UpdateHighlight, ApproveHighlight, RejectHighlight } from "@/types/highlight";

export const useHighlights = () => {
  const queryClient = useQueryClient();
  
  // Listar todos os anúncios
  const { data: highlights, isLoading } = useQuery({
    queryKey: ['highlights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads_highlight')
        .select(`
          *,
          businesses (
            id,
            name,
            image,
            category
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
  
  // Criar anúncio
  const createMutation = useMutation({
    mutationFn: async (highlight: NewHighlight) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('ads_highlight')
        .insert({ ...highlight, created_by: user?.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      toast.success('Anúncio criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar anúncio: ' + error.message);
    },
  });
  
  // Atualizar anúncio
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateHighlight) => {
      const { data, error } = await supabase
        .from('ads_highlight')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      toast.success('Anúncio atualizado!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar anúncio: ' + error.message);
    },
  });
  
  // Deletar anúncio
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ads_highlight')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      toast.success('Anúncio excluído!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao excluir anúncio: ' + error.message);
    },
  });
  
  // Aprovar solicitação
  const approveMutation = useMutation({
    mutationFn: async ({ id, updates }: ApproveHighlight) => {
      const { error } = await supabase
        .from('ads_highlight')
        .update({ 
          ...updates,
          status: 'ativo',
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      toast.success('Solicitação aprovada!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao aprovar: ' + error.message);
    },
  });
  
  // Rejeitar solicitação
  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: RejectHighlight) => {
      const { error } = await supabase
        .from('ads_highlight')
        .update({ 
          status: 'rejeitado',
          notes: reason,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      toast.success('Solicitação rejeitada');
    },
    onError: (error: Error) => {
      toast.error('Erro ao rejeitar: ' + error.message);
    },
  });
  
  return {
    highlights,
    isLoading,
    createHighlight: createMutation.mutate,
    updateHighlight: updateMutation.mutate,
    deleteHighlight: deleteMutation.mutate,
    approveRequest: approveMutation.mutate,
    rejectRequest: rejectMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
