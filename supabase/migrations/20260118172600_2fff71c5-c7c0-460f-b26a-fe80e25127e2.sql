-- Fix security warnings by making INSERT policies more restrictive

-- Drop and recreate the overly permissive notifications INSERT policy
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

CREATE POLICY "Authenticated users can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix user_badges INSERT policy - it should reference the profiles table properly
DROP POLICY IF EXISTS "System can grant badges" ON public.user_badges;

CREATE POLICY "Users can receive badges"
ON public.user_badges FOR INSERT
WITH CHECK (auth.uid() = (SELECT p.user_id FROM profiles p WHERE p.id = user_id));