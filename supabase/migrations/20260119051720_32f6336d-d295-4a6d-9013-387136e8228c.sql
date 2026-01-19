-- Remove overly permissive policy and rely on SECURITY DEFINER function
DROP POLICY IF EXISTS "System can update donation amounts" ON public.donations;

-- Authors can update their own donations (for editing)
DROP POLICY IF EXISTS "Authors can update their donations" ON public.donations;
CREATE POLICY "Authors can update their donations"
ON public.donations
FOR UPDATE
USING (auth.uid() = ( SELECT profiles.user_id FROM profiles WHERE profiles.id = donations.author_id));