-- =====================================================================
-- PDF STUDIO — SUPABASE POSTGRESQL DATABASE SCHEMA & ROW LEVEL SECURITY
-- Platform: Supabase PostgreSQL + Auth + Storage
-- Architecture: Multi-tenant User Partitioned Documents & Recovery Vault
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    provider TEXT DEFAULT 'email',
    storage_limit_bytes BIGINT DEFAULT 1073741824, -- 1 GB default
    terms_version TEXT DEFAULT 'v1.0',
    terms_accepted_at TIMESTAMPTZ DEFAULT NOW(),
    privacy_version TEXT DEFAULT 'v1.0',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 3. FOLDERS TABLE
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    color TEXT DEFAULT '#3b82f6',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own folders"
    ON public.folders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own folders"
    ON public.folders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders"
    ON public.folders FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders"
    ON public.folders FOR DELETE
    USING (auth.uid() = user_id);

-- 4. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    mime_type TEXT DEFAULT 'application/pdf',
    file_size BIGINT NOT NULL,
    storage_key TEXT NOT NULL, -- Key in Supabase Storage private bucket
    page_count INT DEFAULT 1,
    pdf_version TEXT DEFAULT '1.7',
    title TEXT,
    author TEXT,
    subject TEXT,
    thumbnail_url TEXT,
    checksum TEXT NOT NULL, -- SHA-256 for duplicate detection
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'trash', 'archived')),
    is_favorite BOOLEAN DEFAULT FALSE,
    has_password BOOLEAN DEFAULT FALSE,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    retention_expiry TIMESTAMPTZ
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own documents"
    ON public.documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
    ON public.documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
    ON public.documents FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
    ON public.documents FOR DELETE
    USING (auth.uid() = user_id);

-- 5. TAGS & DOCUMENT_TAGS
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tags"
    ON public.tags FOR ALL
    USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.document_tags (
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (document_id, tag_id)
);

ALTER TABLE public.document_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tags of own documents"
    ON public.document_tags FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.documents
            WHERE documents.id = document_tags.document_id
            AND documents.user_id = auth.uid()
        )
    );

-- 6. DOCUMENT VERSIONS TABLE
CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    file_size BIGINT NOT NULL,
    page_count INT NOT NULL,
    summary TEXT,
    storage_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions of own documents"
    ON public.document_versions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.documents
            WHERE documents.id = document_versions.document_id
            AND documents.user_id = auth.uid()
        )
    );

-- 7. SHARE LINKS (Temporary / Password Protected Sharing)
CREATE TABLE IF NOT EXISTS public.share_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    allow_download BOOLEAN DEFAULT TRUE,
    has_password BOOLEAN DEFAULT FALSE,
    password_hash TEXT,
    access_count INT DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage share links"
    ON public.share_links FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Public can view valid active share links"
    ON public.share_links FOR SELECT
    USING (expires_at IS NULL OR expires_at > NOW());

-- 8. ACTIVITY LOGS (Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    document_name TEXT,
    action TEXT NOT NULL,
    description TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity logs"
    ON public.activity_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs"
    ON public.activity_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 9. STORAGE BUCKET POLICIES (Supabase Storage 'user-documents')
-- Bucket 'user-documents' is configured as private
-- SQL policies for storage.objects:
-- SELECT / INSERT / DELETE allowed only where (storage.foldername(name))[1] = auth.uid()::text
