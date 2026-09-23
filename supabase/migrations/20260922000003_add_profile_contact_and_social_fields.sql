-- Migration: 20260922000003_add_profile_contact_and_social_fields.sql
-- Description: Add direct contact (email, phone) and verified profile URLs (contra, linkedin, github, instagram, x) to profile_settings.

ALTER TABLE public.profile_settings
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS contra_url text,
  ADD COLUMN IF NOT EXISTS linkedin_url text,
  ADD COLUMN IF NOT EXISTS github_url text,
  ADD COLUMN IF NOT EXISTS instagram_url text,
  ADD COLUMN IF NOT EXISTS x_url text;

-- Update the singleton row with explicitly user-supplied real profile data
UPDATE public.profile_settings
SET
  full_name = 'Shivam Shukla',
  email = 'theshivamshukla.4uu@gmail.com',
  phone = '8887780625',
  contra_url = 'https://contra.com/shivam_shukla_7duxsdr7/work',
  linkedin_url = 'https://www.linkedin.com/in/shivam-shukla-186276374/',
  github_url = 'https://github.com/shivam-shukla888',
  instagram_url = 'https://www.instagram.com/shastra2003',
  x_url = 'https://x.com/shastra2003',
  updated_at = now()
WHERE is_singleton = true;
