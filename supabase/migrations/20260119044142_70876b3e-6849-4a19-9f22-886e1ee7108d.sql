-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
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

-- RLS policies for user_roles
CREATE POLICY "Anyone can view roles"
ON public.user_roles FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update issues table to allow admin updates
DROP POLICY IF EXISTS "Authors can update their issues" ON public.issues;

CREATE POLICY "Authors and admins can update issues"
ON public.issues FOR UPDATE
USING (
  auth.uid() = (SELECT user_id FROM profiles WHERE id = issues.author_id)
  OR public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete issues
CREATE POLICY "Admins can delete issues"
ON public.issues FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to manage posts
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

CREATE POLICY "Users and admins can delete posts"
ON public.posts FOR DELETE
USING (
  auth.uid() = (SELECT user_id FROM profiles WHERE id = posts.author_id)
  OR public.has_role(auth.uid(), 'admin')
);

-- Allow admins to manage profiles
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));