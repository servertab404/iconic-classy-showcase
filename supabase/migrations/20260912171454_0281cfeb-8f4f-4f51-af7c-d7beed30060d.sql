CREATE TABLE public.site_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Signed-in admin can manage site content" ON public.site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  year text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  href text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published projects" ON public.projects FOR SELECT TO anon USING (published = true);
CREATE POLICY "Signed-in admin can read all projects" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in admin can manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  body text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published posts" ON public.blog_posts FOR SELECT TO anon USING (published = true);
CREATE POLICY "Signed-in admin can read all posts" ON public.blog_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in admin can manage posts" ON public.blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_content (key, value) VALUES
  ('hero_tagline', '"BCA AI/ML student (1st semester) and aspiring machine learning engineer — learning in public, building carefully, one fundamental at a time."'),
  ('about_paragraphs', '["I''m a first-semester BCA (AI/ML) student at Galgotia University. Right now my focus is simple and deliberate: get genuinely good at programming and web development before reaching for the hard machine learning material.","That means writing a lot of Python, understanding how the web actually renders, and shipping small things end to end instead of collecting tutorials. The long-term goal is machine learning engineering — the short-term goal is a solid foundation."]'),
  ('contact_email', '"severtab404@gmail.com"'),
  ('skills', '[{"name":"Python","status":"In progress","value":35},{"name":"HTML / CSS","status":"Practising","value":55},{"name":"AI/ML Foundations","status":"Planned","value":10}]'),
  ('education', '{"program":"BCA — Artificial Intelligence & Machine Learning","university":"Galgotia University","period":"2026 — Present","note":"Galgotia University · 1st semester, currently ongoing. Coursework in programming fundamentals, computing basics and web development."}');

INSERT INTO public.projects (title, year, summary, tags, href, sort_order) VALUES
  ('Aethergrid', '2026', 'A real-time 3D globe intelligence concept that fuses live aircraft tracking, satellite orbits and environmental data into one interactive view. Built as a live prototype using an AI-assisted no-code builder to test the idea quickly.', ARRAY['3D Globe','Live Data','Concept Prototype','No-code + AI'], 'https://athergrid.base44.app', 0),
  ('Personal Portfolio Site', '2026', 'This website. A dark, motion-led portfolio with a WebGL neural-network hero, a custom cursor, magnetic buttons and scroll-driven reveals — designed as a study in interaction craft and performance budgets.', ARRAY['Three.js','Motion','Design System','Accessibility'], '#hero', 1);