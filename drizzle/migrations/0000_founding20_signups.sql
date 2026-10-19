CREATE TABLE public.founding20_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 60),
  email text NOT NULL CHECK (char_length(email) <= 255),
  consent boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.founding20_signups TO service_role;
ALTER TABLE public.founding20_signups ENABLE ROW LEVEL SECURITY;