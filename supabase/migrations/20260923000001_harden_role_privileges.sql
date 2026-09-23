-- Migration: 20260923000001_harden_role_privileges.sql
-- Description: Phase 22 Security Hardening - Defense-in-depth privilege revocation for public roles (anon, authenticated).
-- Enforces that zero public mutations (INSERT, UPDATE, DELETE, TRUNCATE) are possible at the database privilege level,
-- and locks down contact_submissions from all public interaction (handled strictly via server-side service_role).

-- 1. Revoke all mutation privileges on content tables from anon and authenticated roles.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.profile_settings FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.projects FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.services FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.products FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.lab_entries FROM anon, authenticated;

-- 2. Revoke whole-table privileges on contact_submissions from anon and authenticated roles.
-- Public client interactions must route exclusively through the server action using service_role.
REVOKE ALL ON TABLE public.contact_submissions FROM anon, authenticated;

-- 3. Explicitly grant full administrative access on all public tables to service_role.
GRANT ALL ON TABLE public.profile_settings TO service_role;
GRANT ALL ON TABLE public.projects TO service_role;
GRANT ALL ON TABLE public.services TO service_role;
GRANT ALL ON TABLE public.products TO service_role;
GRANT ALL ON TABLE public.lab_entries TO service_role;
GRANT ALL ON TABLE public.contact_submissions TO service_role;

-- 4. Ensure future tables created in public schema do not automatically grant mutations to public roles.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLES FROM anon, authenticated;
