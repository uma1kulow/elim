-- Create village history table
CREATE TABLE public.village_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  village_id UUID REFERENCES public.villages(id),
  title TEXT NOT NULL,
  title_kg TEXT,
  description TEXT NOT NULL,
  description_kg TEXT,
  year INTEGER,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'general', -- founding, event, construction, person
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  author_id UUID REFERENCES public.profiles(id)
);

-- Create village future plans table
CREATE TABLE public.village_future_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  village_id UUID REFERENCES public.villages(id),
  title TEXT NOT NULL,
  title_kg TEXT,
  description TEXT NOT NULL,
  description_kg TEXT,
  target_year INTEGER,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'planned', -- planned, in_progress, completed
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  author_id UUID REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.village_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_future_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for village_history
CREATE POLICY "Village history is viewable by everyone"
ON public.village_history FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create history"
ON public.village_history FOR INSERT
WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = author_id));

CREATE POLICY "Authors can update their history entries"
ON public.village_history FOR UPDATE
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = author_id));

-- RLS policies for village_future_plans
CREATE POLICY "Village future plans are viewable by everyone"
ON public.village_future_plans FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create plans"
ON public.village_future_plans FOR INSERT
WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = author_id));

CREATE POLICY "Authors can update their plans"
ON public.village_future_plans FOR UPDATE
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = author_id));

-- Insert sample history data
INSERT INTO public.village_history (title, title_kg, description, description_kg, year, category) VALUES
('Айылдын негиздөөсү', 'Айылдын негиздөөсү', 'Айыл 1920-жылы негизделген. Биринчи турак жайлар курулган.', 'Айыл 1920-жылы негизделген. Биринчи турак жайлар курулган.', 1920, 'founding'),
('Биринчи мектеп', 'Биринчи мектеп', '1935-жылы айылда биринчи мектеп ачылган.', '1935-жылы айылда биринчи мектеп ачылган.', 1935, 'construction'),
('Электр энергиясы', 'Электр энергиясы', '1960-жылы айылга электр энергиясы тартылган.', '1960-жылы айылга электр энергиясы тартылган.', 1960, 'event'),
('Жаңы жол курулушу', 'Жаңы жол курулушу', '2010-жылы айылдын борбордук жолу оңдолгон.', '2010-жылы айылдын борбордук жолу оңдолгон.', 2010, 'construction');

-- Insert sample future plans
INSERT INTO public.village_future_plans (title, title_kg, description, description_kg, target_year, status, priority) VALUES
('Жаңы мечит курулушу', 'Жаңы мечит курулушу', 'Айылга чоң мечит курулат, 500 адамга ылайыкталган.', 'Айылга чоң мечит курулат, 500 адамга ылайыкталган.', 2026, 'planned', 1),
('Көп кабаттуу үйлөр', 'Көп кабаттуу үйлөр', '5 кабаттуу турак үй комплекси курулат.', '5 кабаттуу турак үй комплекси курулат.', 2027, 'planned', 2),
('Спорт комплекси', 'Спорт комплекси', 'Заманбап спорт комплекси курулат: бассейн, спорт зал.', 'Заманбап спорт комплекси курулат: бассейн, спорт зал.', 2028, 'planned', 3),
('Жаңы парк', 'Жаңы парк', 'Балдар жана үй-бүлөлөр үчүн чоң парк түзүлөт.', 'Балдар жана үй-бүлөлөр үчүн чоң парк түзүлөт.', 2025, 'in_progress', 4);