-- Criar bucket para imagens de empresas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('business-images', 'business-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies para storage
CREATE POLICY "Public can view business images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'business-images');

CREATE POLICY "Authenticated users can upload business images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'business-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Admins can delete any business image"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'business-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Business owners can delete their business images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'business-images' AND
    (storage.foldername(name))[1] IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );