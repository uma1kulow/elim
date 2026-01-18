-- Create weekly_missions table
CREATE TABLE public.weekly_missions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  title_kg text,
  description text,
  description_kg text,
  target_count integer NOT NULL DEFAULT 5,
  reward_points integer NOT NULL DEFAULT 50,
  mission_type text NOT NULL DEFAULT 'issues', -- issues, posts, donations, votes
  village_id uuid REFERENCES public.villages(id),
  starts_at timestamp with time zone NOT NULL DEFAULT date_trunc('week', now()),
  ends_at timestamp with time zone NOT NULL DEFAULT date_trunc('week', now()) + interval '7 days',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Create user_mission_progress table
CREATE TABLE public.user_mission_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id uuid NOT NULL REFERENCES public.weekly_missions(id) ON DELETE CASCADE,
  current_progress integer NOT NULL DEFAULT 0,
  is_completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, mission_id)
);

-- Enable RLS
ALTER TABLE public.weekly_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mission_progress ENABLE ROW LEVEL SECURITY;

-- Policies for weekly_missions
CREATE POLICY "Weekly missions are viewable by everyone"
ON public.weekly_missions FOR SELECT USING (true);

-- Policies for user_mission_progress
CREATE POLICY "Users can view their mission progress"
ON public.user_mission_progress FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_mission_progress.user_id));

CREATE POLICY "Users can insert their mission progress"
ON public.user_mission_progress FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_mission_progress.user_id));

CREATE POLICY "Users can update their mission progress"
ON public.user_mission_progress FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_mission_progress.user_id));

-- Insert sample weekly missions
INSERT INTO public.weekly_missions (title, title_kg, description, description_kg, target_count, reward_points, mission_type) VALUES
('Resolve 5 issues', 'Көйгөйдү чечүү', 'Help resolve community issues', '5 көйгөйдү чечүү', 5, 50, 'issues'),
('Create 3 posts', 'Пост жазуу', 'Share with your community', '3 пост жарыялоо', 3, 30, 'posts'),
('Vote in 2 polls', 'Добуш берүү', 'Participate in village decisions', '2 добуш берүү', 2, 20, 'votes'),
('Support 1 donation', 'Донат кылуу', 'Contribute to community projects', '1 донатка катышуу', 1, 40, 'donations');