-- ==============================================================================
-- SHIVSASTRA // SUPABASE DATABASE FOUNDATION (PHASE 7)
-- Architecture: Supabase Postgres 17+
-- Target Project: vahalxnimswrhmoyzbse (shivashastra)
-- Tables: profile_settings, projects, services, products, lab_entries, contact_submissions
-- Security: Row Level Security (RLS) enabled on all tables; zero public write policies.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- EXTENSIONS & HELPER FUNCTIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 1. PROFILE SETTINGS (Singleton Configuration)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_singleton boolean NOT NULL DEFAULT true,
  full_name text NOT NULL DEFAULT 'Shivam',
  positioning_statement text,
  hero_supporting_text text,
  about_markdown text,
  contact_instructions text,
  availability_status text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profile_settings_singleton_chk CHECK (is_singleton),
  CONSTRAINT profile_settings_singleton_uniq UNIQUE (is_singleton)
);

CREATE TRIGGER update_profile_settings_updated_at
  BEFORE UPDATE ON profile_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed single structural row with zero fictional claims (content left NULL)
INSERT INTO profile_settings (id, full_name, is_singleton)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'Shivam', true)
ON CONFLICT (is_singleton) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. PROJECTS (Curated Work Monographs & Case Studies)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  edition_code text,
  summary text,
  case_study_markdown text,
  cover_image_url text,
  category text,
  tech_stack text[] NOT NULL DEFAULT '{}'::text[],
  project_year integer,
  live_url text,
  github_url text,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_published_at ON projects (published_at) WHERE published_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (is_featured, sort_order) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects (sort_order ASC, created_at DESC);

-- ------------------------------------------------------------------------------
-- 3. SERVICES (Bespoke Advisory Offerings & Capabilities)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  program_code text,
  title text NOT NULL,
  summary text,
  description_markdown text,
  engagement_model text,
  deliverables text[] NOT NULL DEFAULT '{}'::text[],
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_services_slug ON services (slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services (is_active, sort_order) WHERE is_active = true;

-- ------------------------------------------------------------------------------
-- 4. PRODUCTS (Curated Studio Store Releases)
-- Note: Razorpay-compatible integer pricing; zero Stripe-specific columns.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  release_code text,
  title text NOT NULL,
  description text,
  price_in_cents integer NOT NULL CHECK (price_in_cents >= 0),
  currency text NOT NULL DEFAULT 'INR',
  product_type text NOT NULL CHECK (product_type IN ('digital_download', 'code_license', 'template', 'monograph')),
  preview_image_url text,
  storage_asset_path text,
  is_available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_available ON products (is_available, sort_order) WHERE is_available = true;

-- ------------------------------------------------------------------------------
-- 5. LAB ENTRIES (Isolated Creative Technology Sandbox)
-- Strictly restricted to the 4 categories defined in Master Context.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lab_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('idea', 'build', 'stack', 'thought')),
  title text NOT NULL,
  content_markdown text,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'wip', 'experimental', 'archived', 'published')),
  is_public boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER update_lab_entries_updated_at
  BEFORE UPDATE ON lab_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_lab_entries_slug ON lab_entries (slug);
CREATE INDEX IF NOT EXISTS idx_lab_entries_public ON lab_entries (is_public, published_at) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_lab_entries_category ON lab_entries (category);

-- ------------------------------------------------------------------------------
-- 6. CONTACT SUBMISSIONS (Transactional Client Inquiries)
-- Note: Raw IP addresses are NEVER stored; only salted SHA-256 hashes.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  brief text NOT NULL,
  ip_hash text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_unread ON contact_submissions (is_read, created_at DESC) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions (created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- 1. Profile Settings
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for profile settings"
  ON profile_settings FOR SELECT
  TO public
  USING (true);

-- 2. Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for published projects"
  ON projects FOR SELECT
  TO public
  USING (published_at IS NOT NULL);

-- 3. Services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for active services"
  ON services FOR SELECT
  TO public
  USING (is_active = true);

-- 4. Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for available products"
  ON products FOR SELECT
  TO public
  USING (is_available = true);

-- 5. Lab Entries
ALTER TABLE lab_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for published lab entries"
  ON lab_entries FOR SELECT
  TO public
  USING (is_public = true AND published_at IS NOT NULL);

-- 6. Contact Submissions
-- Strictly locked: NO public/anon policies. Inaccessible to anonymous browser contexts.
-- Writes and reads occur strictly through the server-side service_role boundary.
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Note: Administrative mutations (INSERT, UPDATE, DELETE) will be granted to authenticated
-- administrators once the Supabase Auth / Admin Dashboard phase is implemented.
