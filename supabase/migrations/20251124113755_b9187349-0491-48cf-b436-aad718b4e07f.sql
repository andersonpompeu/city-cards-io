-- Criar tabela para analytics de empresas
CREATE TABLE IF NOT EXISTS public.business_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'phone_click', 'whatsapp_click', 'website_click', 'email_click')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_business_analytics_business_id ON public.business_analytics(business_id);
CREATE INDEX IF NOT EXISTS idx_business_analytics_event_type ON public.business_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_business_analytics_created_at ON public.business_analytics(created_at DESC);

-- Habilitar RLS
ALTER TABLE public.business_analytics ENABLE ROW LEVEL SECURITY;

-- Política para inserção pública (permitir tracking anônimo)
CREATE POLICY "Anyone can insert analytics events"
ON public.business_analytics
FOR INSERT
WITH CHECK (true);

-- Política para visualização por admins
CREATE POLICY "Admins can view all analytics"
ON public.business_analytics
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Política para business owners visualizarem seus próprios analytics
CREATE POLICY "Business owners can view their analytics"
ON public.business_analytics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = business_analytics.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Criar função para obter estatísticas de analytics
CREATE OR REPLACE FUNCTION public.get_business_analytics_stats(
  p_business_id TEXT,
  p_start_date TIMESTAMPTZ DEFAULT (now() - interval '30 days'),
  p_end_date TIMESTAMPTZ DEFAULT now()
)
RETURNS TABLE (
  event_type TEXT,
  count BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    event_type,
    COUNT(*) as count
  FROM public.business_analytics
  WHERE business_id = p_business_id
    AND created_at >= p_start_date
    AND created_at <= p_end_date
  GROUP BY event_type
  ORDER BY count DESC;
$$;