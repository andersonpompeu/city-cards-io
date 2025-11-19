import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessWithHighlight } from "@/types/highlight";

export const useBusinessesWithHighlight = () => {
  return useQuery({
    queryKey: ['businesses-with-highlight'],
    queryFn: async () => {
      // Buscar empresas aprovadas
      const { data: businesses, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('status', 'approved');
      
      if (businessError) throw businessError;

      // Buscar destaques ativos
      const today = new Date().toISOString().split('T')[0];
      const { data: highlights, error: highlightError } = await supabase
        .from('ads_highlight')
        .select('*')
        .eq('status', 'ativo')
        .lte('start_date', today)
        .gte('end_date', today);
      
      if (highlightError) throw highlightError;

      // Mapear empresas com seus destaques e ordenar
      const businessesWithHighlight: BusinessWithHighlight[] = (businesses || []).map((business: any) => {
        const highlight = highlights?.find(h => h.business_id === business.id);
        return {
          ...business,
          highlight: highlight || null,
        };
      });

      // Ordenar: destacados primeiro
      return businessesWithHighlight.sort((a, b) => {
        // 1. Fixados no topo primeiro
        if (a.highlight?.pin_to_top && !b.highlight?.pin_to_top) return -1;
        if (!a.highlight?.pin_to_top && b.highlight?.pin_to_top) return 1;
        
        // 2. Com destaque antes de sem destaque
        if (a.highlight && !b.highlight) return -1;
        if (!a.highlight && b.highlight) return 1;
        
        // 3. Se ambos têm destaque, ordenar por nível
        if (a.highlight && b.highlight) {
          const levelOrder = { premium: 0, alto: 1, padrao: 2 };
          const levelDiff = levelOrder[a.highlight.level] - levelOrder[b.highlight.level];
          if (levelDiff !== 0) return levelDiff;
          
          // 4. Ordem manual
          if (a.highlight.manual_order && b.highlight.manual_order) {
            return a.highlight.manual_order - b.highlight.manual_order;
          }
          if (a.highlight.manual_order) return -1;
          if (b.highlight.manual_order) return 1;
        }
        
        // 5. Sem destaque: ordenar por nota
        return (b.rating || 0) - (a.rating || 0);
      });
    },
  });
};
