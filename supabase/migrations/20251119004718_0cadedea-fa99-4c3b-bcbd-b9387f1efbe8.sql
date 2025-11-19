-- =============================================
-- SISTEMA DE ROLES E PERMISSÕES
-- =============================================

-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'business_owner', 'user');

-- Criar tabela de roles de usuários
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função para verificar roles (SECURITY DEFINER para evitar recursão RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policies para user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- ATUALIZAR TABELA BUSINESSES
-- =============================================

-- Adicionar colunas para gestão
ALTER TABLE public.businesses
  ADD COLUMN owner_id UUID REFERENCES auth.users(id),
  ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'inactive')),
  ADD COLUMN approved_at TIMESTAMPTZ,
  ADD COLUMN approved_by UUID REFERENCES auth.users(id),
  ADD COLUMN rejection_reason TEXT,
  ADD COLUMN views_count INT DEFAULT 0,
  ADD COLUMN gallery_images TEXT[] DEFAULT '{}';

-- Atualizar empresas existentes para aprovadas
UPDATE public.businesses SET status = 'approved' WHERE status = 'pending';

-- Remover policies antigas
DROP POLICY IF EXISTS "Businesses are viewable by everyone" ON public.businesses;

-- Novas policies para businesses
CREATE POLICY "Public can view approved businesses"
  ON public.businesses
  FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Admins can view all businesses"
  ON public.businesses
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners can view their own business"
  ON public.businesses
  FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins can insert businesses"
  ON public.businesses
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Business owners can insert their own business"
  ON public.businesses
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins can update any business"
  ON public.businesses
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners can update their own business"
  ON public.businesses
  FOR UPDATE
  USING (auth.uid() = owner_id AND status != 'rejected');

CREATE POLICY "Admins can delete businesses"
  ON public.businesses
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- CRIAR TABELA DE CATEGORIAS
-- =============================================

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Policies para categories
CREATE POLICY "Public can view categories"
  ON public.categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.categories
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger para updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Popular categorias iniciais
INSERT INTO public.categories (name, slug, icon) VALUES
  ('Eletricista', 'eletricista', 'Zap'),
  ('Encanador', 'encanador', 'Droplet'),
  ('Pedreiro', 'pedreiro', 'Hammer'),
  ('Pintor', 'pintor', 'Paintbrush'),
  ('Marceneiro', 'marceneiro', 'Wrench'),
  ('Restaurante', 'restaurante', 'Utensils'),
  ('Lanchonete', 'lanchonete', 'Coffee'),
  ('Pizzaria', 'pizzaria', 'Pizza'),
  ('Cafeteria', 'cafeteria', 'Coffee'),
  ('Clínica', 'clinica', 'Heart'),
  ('Consultório', 'consultorio', 'Stethoscope'),
  ('Dentista', 'dentista', 'Smile'),
  ('Veterinário', 'veterinario', 'Dog'),
  ('Pet Shop', 'pet-shop', 'PawPrint'),
  ('Academia', 'academia', 'Dumbbell'),
  ('Salão de Beleza', 'salao-beleza', 'Scissors'),
  ('Barbearia', 'barbearia', 'Scissors'),
  ('Tecnologia', 'tecnologia', 'Laptop'),
  ('Consultoria', 'consultoria', 'Briefcase'),
  ('Advocacia', 'advocacia', 'Scale'),
  ('Contabilidade', 'contabilidade', 'Calculator'),
  ('Loja', 'loja', 'ShoppingBag'),
  ('Mercado', 'mercado', 'ShoppingCart'),
  ('Farmácia', 'farmacia', 'Pill');

-- =============================================
-- CRIAR TABELA DE RESPOSTAS A AVALIAÇÕES
-- =============================================

CREATE TABLE public.review_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
  business_id TEXT REFERENCES public.businesses(id) NOT NULL,
  response_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(review_id)
);

-- Habilitar RLS
ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;

-- Policies para review_responses
CREATE POLICY "Public can view responses"
  ON public.review_responses
  FOR SELECT
  USING (true);

CREATE POLICY "Business owners can create responses"
  ON public.review_responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = business_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can update their responses"
  ON public.review_responses
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = business_id AND owner_id = auth.uid()
    )
  );

-- Trigger para updated_at
CREATE TRIGGER update_review_responses_updated_at
  BEFORE UPDATE ON public.review_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- CRIAR TABELA DE CONFIGURAÇÕES DA PLATAFORMA
-- =============================================

CREATE TABLE public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Policies para platform_settings
CREATE POLICY "Public can view settings"
  ON public.platform_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON public.platform_settings
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Configurações iniciais
INSERT INTO public.platform_settings (key, value) VALUES
  ('platform_name', '"Guia Local Maringá"'),
  ('platform_logo', '""'),
  ('primary_color', '"#3B82F6"'),
  ('seo_title', '"Guia Local de Empresas em Maringá - Encontre Serviços Locais"'),
  ('seo_description', '"Descubra as melhores empresas e serviços em Maringá. Avaliações reais de clientes, contatos diretos e informações completas."'),
  ('analytics_id', '""');