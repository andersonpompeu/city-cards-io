-- Add missing roles for existing users
-- This migration adds business_owner roles to users who have businesses but no role assigned

-- Add business_owner role to users who own businesses but don't have a role yet
INSERT INTO public.user_roles (user_id, role)
SELECT DISTINCT b.owner_id, 'business_owner'::app_role
FROM public.businesses b
WHERE b.owner_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = b.owner_id
  )
ON CONFLICT (user_id, role) DO NOTHING;