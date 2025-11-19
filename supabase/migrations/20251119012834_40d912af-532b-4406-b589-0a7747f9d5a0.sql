-- Adicionar campos de SEO às empresas
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS keywords text[],
ADD COLUMN IF NOT EXISTS neighborhood text,
ADD COLUMN IF NOT EXISTS long_description text;

-- Criar índice para busca por slug
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);

-- Função para gerar slug automaticamente
CREATE OR REPLACE FUNCTION generate_slug(name text, id text)
RETURNS text AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Normalizar o nome para criar o slug
  base_slug := lower(trim(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  
  -- Limitar o tamanho do slug
  base_slug := substring(base_slug, 1, 50);
  
  -- Adicionar ID no final para garantir unicidade
  final_slug := base_slug || '-' || substring(id, 1, 8);
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Atualizar slugs existentes
UPDATE businesses
SET slug = generate_slug(name, id)
WHERE slug IS NULL;

-- Trigger para gerar slug automaticamente em novos registros
CREATE OR REPLACE FUNCTION set_business_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := generate_slug(NEW.name, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_business_slug
BEFORE INSERT OR UPDATE ON businesses
FOR EACH ROW
EXECUTE FUNCTION set_business_slug();

-- Adicionar configurações SEO globais na tabela platform_settings
INSERT INTO platform_settings (key, value)
VALUES 
  ('seo_site_title', '"Diretório de Empresas Locais - Maringá, PR"'::jsonb),
  ('seo_site_description', '"Encontre empresas e serviços locais de qualidade em Maringá. Busque por categorias e localize negócios próximos a você."'::jsonb),
  ('seo_keywords', '["diretório empresas maringá", "serviços locais", "empresas maringá", "guia comercial"]'::jsonb),
  ('seo_og_image', '"/placeholder.svg"'::jsonb),
  ('seo_robots_index', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Adicionar campos SEO às categorias
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS long_description text;

-- Comentários para documentação
COMMENT ON COLUMN businesses.slug IS 'URL-friendly identifier for SEO';
COMMENT ON COLUMN businesses.meta_description IS 'Short description for meta tags (max 160 chars)';
COMMENT ON COLUMN businesses.keywords IS 'SEO keywords array';
COMMENT ON COLUMN businesses.neighborhood IS 'Neighborhood/Bairro for local SEO';
COMMENT ON COLUMN businesses.long_description IS 'Long-form description for SEO (min 400 words recommended)';