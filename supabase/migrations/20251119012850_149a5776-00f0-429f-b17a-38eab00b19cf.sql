-- Corrigir search_path das funções criadas

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
$$ LANGUAGE plpgsql
SET search_path TO 'public';

CREATE OR REPLACE FUNCTION set_business_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := generate_slug(NEW.name, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path TO 'public';