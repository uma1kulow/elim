-- Create villages table with complete Kyrgyzstan data
CREATE TABLE public.villages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_kg TEXT,
  region TEXT NOT NULL,
  district TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  population INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;

-- Villages are viewable by everyone
CREATE POLICY "Villages are viewable by everyone"
ON public.villages FOR SELECT
USING (true);

-- Create badges table for gamification
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_kg TEXT,
  description TEXT,
  description_kg TEXT,
  icon TEXT NOT NULL,
  points_required INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone"
ON public.badges FOR SELECT
USING (true);

-- Create user_badges table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User badges are viewable by everyone"
ON public.user_badges FOR SELECT
USING (true);

CREATE POLICY "System can grant badges"
ON public.user_badges FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create voting_polls table
CREATE TABLE public.voting_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_kg TEXT,
  description TEXT,
  description_kg TEXT,
  village_id UUID REFERENCES public.villages(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.voting_polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Polls are viewable by everyone"
ON public.voting_polls FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create polls"
ON public.voting_polls FOR INSERT
WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = author_id));

-- Create poll_options table
CREATE TABLE public.poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES public.voting_polls(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  text_kg TEXT,
  votes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Options are viewable by everyone"
ON public.poll_options FOR SELECT
USING (true);

CREATE POLICY "Poll authors can create options"
ON public.poll_options FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM voting_polls vp
  JOIN profiles p ON vp.author_id = p.id
  WHERE vp.id = poll_id AND p.user_id = auth.uid()
));

-- Create votes table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES public.voting_polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(poll_id, user_id)
);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Votes are viewable by everyone"
ON public.votes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can vote"
ON public.votes FOR INSERT
WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_id));

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_kg TEXT,
  description TEXT,
  description_kg TEXT,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  village_id UUID REFERENCES public.villages(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donations are viewable by everyone"
ON public.donations FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create donations"
ON public.donations FOR INSERT
WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = author_id));

-- Create donation_contributions table
CREATE TABLE public.donation_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.donation_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contributions are viewable by everyone"
ON public.donation_contributions FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can contribute"
ON public.donation_contributions FOR INSERT
WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_id));

-- Create complaints/issues table
CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_kg TEXT,
  description TEXT NOT NULL,
  description_kg TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'pending',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  village_id UUID REFERENCES public.villages(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT,
  votes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Issues are viewable by everyone"
ON public.issues FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create issues"
ON public.issues FOR INSERT
WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = author_id));

CREATE POLICY "Authors can update their issues"
ON public.issues FOR UPDATE
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = author_id));

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  title_kg TEXT,
  message TEXT NOT NULL,
  message_kg TEXT,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_id));

CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_id));

-- Create jobs table for economy
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_kg TEXT,
  description TEXT NOT NULL,
  description_kg TEXT,
  company_name TEXT NOT NULL,
  salary_min DECIMAL(12, 2),
  salary_max DECIMAL(12, 2),
  job_type TEXT NOT NULL DEFAULT 'full-time',
  village_id UUID REFERENCES public.villages(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are viewable by everyone"
ON public.jobs FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create jobs"
ON public.jobs FOR INSERT
WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = author_id));

CREATE POLICY "Authors can update their jobs"
ON public.jobs FOR UPDATE
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = author_id));

CREATE POLICY "Authors can delete their jobs"
ON public.jobs FOR DELETE
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = author_id));

-- Create businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_kg TEXT,
  description TEXT,
  description_kg TEXT,
  category TEXT NOT NULL,
  village_id UUID REFERENCES public.villages(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  address TEXT,
  phone TEXT,
  website TEXT,
  image_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Businesses are viewable by everyone"
ON public.businesses FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create businesses"
ON public.businesses FOR INSERT
WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = owner_id));

CREATE POLICY "Owners can update their businesses"
ON public.businesses FOR UPDATE
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = owner_id));

-- Create chat_bot_messages table for AI assistant
CREATE TABLE public.chat_bot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.chat_bot_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their chat messages"
ON public.chat_bot_messages FOR SELECT
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_id));

CREATE POLICY "Users can create chat messages"
ON public.chat_bot_messages FOR INSERT
WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_id));

-- Function to update vote counts
CREATE OR REPLACE FUNCTION public.update_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.poll_options SET votes_count = votes_count + 1 WHERE id = NEW.option_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.poll_options SET votes_count = votes_count - 1 WHERE id = OLD.option_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_vote_count_trigger
AFTER INSERT OR DELETE ON public.votes
FOR EACH ROW
EXECUTE FUNCTION public.update_vote_count();

-- Function to update donation amounts
CREATE OR REPLACE FUNCTION public.update_donation_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.donations SET current_amount = current_amount + NEW.amount WHERE id = NEW.donation_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_donation_amount_trigger
AFTER INSERT ON public.donation_contributions
FOR EACH ROW
EXECUTE FUNCTION public.update_donation_amount();

-- Function to update user score
CREATE OR REPLACE FUNCTION public.add_user_score(p_user_id UUID, p_points INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles SET score = COALESCE(score, 0) + p_points WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SET search_path = public;