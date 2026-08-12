CREATE TABLE public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now() not null,
  constraint email_format check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

GRANT ALL ON public.contact_submissions TO service_role;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Only service_role can read/write; public submissions go through the server function.
CREATE POLICY "Service role full access"
  ON public.contact_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);