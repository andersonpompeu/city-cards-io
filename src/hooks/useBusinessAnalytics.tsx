import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBusinessAnalytics = (businessId: string) => {
  return useQuery({
    queryKey: ['business-analytics', businessId],
    queryFn: async () => {
      // Buscar estatísticas dos últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('business_analytics')
        .select('event_type')
        .eq('business_id', businessId)
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;

      // Contar eventos por tipo
      const stats = {
        views: 0,
        phone_clicks: 0,
        whatsapp_clicks: 0,
        email_clicks: 0,
        website_clicks: 0,
      };

      data?.forEach((item) => {
        if (item.event_type === 'view') stats.views++;
        else if (item.event_type === 'phone_click') stats.phone_clicks++;
        else if (item.event_type === 'whatsapp_click') stats.whatsapp_clicks++;
        else if (item.event_type === 'email_click') stats.email_clicks++;
        else if (item.event_type === 'website_click') stats.website_clicks++;
      });

      return stats;
    },
    enabled: !!businessId,
  });
};
