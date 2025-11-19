-- Criar enum para níveis de destaque
CREATE TYPE highlight_level AS ENUM ('premium', 'alto', 'padrao');

-- Criar enum para status
CREATE TYPE highlight_status AS ENUM ('ativo', 'expirado', 'pausado', 'aguardando_aprovacao', 'rejeitado');

-- Tabela principal de anúncios
CREATE TABLE ads_highlight (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id text REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  level highlight_level NOT NULL DEFAULT 'padrao',
  start_date date NOT NULL,
  end_date date NOT NULL,
  status highlight_status NOT NULL DEFAULT 'ativo',
  manual_order int DEFAULT NULL,
  pin_to_top boolean DEFAULT false,
  badge_color text DEFAULT '#FFD700',
  border_color text DEFAULT '#FFD700',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  notes text,
  request_notes text,
  
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Índices para performance
CREATE INDEX idx_ads_highlight_status ON ads_highlight(status);
CREATE INDEX idx_ads_highlight_dates ON ads_highlight(start_date, end_date);
CREATE INDEX idx_ads_highlight_business ON ads_highlight(business_id);
CREATE INDEX idx_ads_highlight_active ON ads_highlight(status, level, manual_order) WHERE status = 'ativo';

-- Trigger para updated_at
CREATE TRIGGER set_ads_highlight_updated_at
  BEFORE UPDATE ON ads_highlight
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Tabela para configurações globais do módulo
CREATE TABLE ads_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  max_active_highlights int DEFAULT 5,
  auto_expire_enabled boolean DEFAULT true,
  default_duration_days int DEFAULT 30,
  premium_color text DEFAULT '#FFD700',
  alto_color text DEFAULT '#3B82F6',
  padrao_color text DEFAULT '#10B981',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inserir configuração padrão
INSERT INTO ads_settings (max_active_highlights) VALUES (5);

-- Habilitar RLS
ALTER TABLE ads_highlight ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads_settings ENABLE ROW LEVEL SECURITY;

-- Policies para ads_highlight
CREATE POLICY "Public can view active highlights"
  ON ads_highlight FOR SELECT
  USING (status = 'ativo' AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

CREATE POLICY "Admins can manage all highlights"
  ON ads_highlight FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Business owners can view their own highlight requests"
  ON ads_highlight FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = ads_highlight.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can request highlights"
  ON ads_highlight FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = ads_highlight.business_id 
      AND businesses.owner_id = auth.uid()
    )
    AND status = 'aguardando_aprovacao'
  );

-- Policies para ads_settings
CREATE POLICY "Admins can manage settings"
  ON ads_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view settings"
  ON ads_settings FOR SELECT
  USING (true);

-- Função para expirar anúncios automaticamente
CREATE OR REPLACE FUNCTION expire_old_highlights()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE ads_highlight
  SET status = 'expirado',
      updated_at = now()
  WHERE status = 'ativo'
    AND end_date < CURRENT_DATE;
END;
$$;