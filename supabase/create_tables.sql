-- Define the fixed roles and ticket statuses
CREATE TYPE user_role AS ENUM ('system_admin', 'hq_admin', 'center_admin', 'member');
CREATE TYPE ticket_status AS ENUM ('Open', 'Overdue', 'Closed');

-- 1. Centers Table
CREATE TABLE public.centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    region TEXT,
    contact_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles (Users) Table linked to Supabase Auth
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role user_role DEFAULT 'member' NOT NULL,
    center_id UUID REFERENCES public.centers(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tickets (Izimo) Table
CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status ticket_status DEFAULT 'Open' NOT NULL,
    center_id UUID REFERENCES public.centers(id) NOT NULL,
    created_by UUID REFERENCES public.profiles(id) NOT NULL,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);