import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HighlightRequest } from "@/types/highlight";

export const useBusinessHighlight = (businessId: string) => {
  const queryClient = useQueryClient();
  
  // Buscar destaque da empresa
  const { data: highlight, isLoading } = useQuery({
    queryKey: ['business-highlight', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads_highlight')
        .select('*')
        .eq('business_id', businessId)
        .in('status', ['ativo', 'aguardando_aprovacao', 'pausado'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });
  
  // Solicitar destaque
  const requestMutation = useMutation({
    mutationFn: async (request: HighlightRequest) => {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + request.duration_days);
      
      const { data, error } = await supabase
        .from('ads_highlight')
        .insert({
          business_id: businessId,
          level: request.level,
          start_date: new Date().toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'aguardando_aprovacao',
          request_notes: request.notes,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-highlight'] });
      toast.success('Solicitação enviada! Aguarde aprovação.');
    },
    onError: (error: Error) => {
      toast.error('Erro ao solicitar destaque: ' + error.message);
    },
  });
  
  return {
    highlight,
    isLoading,
    hasActiveHighlight: highlight?.status === 'ativo',
    hasPendingRequest: highlight?.status === 'aguardando_aprovacao',
    requestHighlight: requestMutation.mutate,
    isRequesting: requestMutation.isPending,
  };
};
