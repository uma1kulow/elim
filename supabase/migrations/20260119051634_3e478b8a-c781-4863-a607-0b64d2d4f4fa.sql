-- Create function to update donation current_amount when contribution is made
CREATE OR REPLACE FUNCTION public.update_donation_amount()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.donations
  SET current_amount = current_amount + NEW.amount
  WHERE id = NEW.donation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic amount updates
DROP TRIGGER IF EXISTS update_donation_amount_trigger ON public.donation_contributions;
CREATE TRIGGER update_donation_amount_trigger
AFTER INSERT ON public.donation_contributions
FOR EACH ROW
EXECUTE FUNCTION public.update_donation_amount();

-- Fix RLS policy for donation_contributions - the current policy has wrong condition
DROP POLICY IF EXISTS "Authenticated users can contribute" ON public.donation_contributions;
CREATE POLICY "Authenticated users can contribute" 
ON public.donation_contributions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Add UPDATE policy for donations to allow trigger to work
DROP POLICY IF EXISTS "System can update donation amounts" ON public.donations;
CREATE POLICY "System can update donation amounts"
ON public.donations
FOR UPDATE
USING (true)
WITH CHECK (true);