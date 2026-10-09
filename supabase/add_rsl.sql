-- Enable RLS on the tables
ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Members can see and create their own tickets
CREATE POLICY "Members manage own tickets" ON public.tickets
    FOR ALL
    USING (auth.uid() = created_by);

-- POLICY 2: Center Admins can see tickets assigned to their specific center
CREATE POLICY "Center Admins view center tickets" ON public.tickets
    FOR SELECT
    USING (
        center_id IN (
            SELECT center_id FROM public.profiles 
            WHERE id = auth.uid() AND role = 'center_admin'
        )
    );

-- POLICY 3: HQ Admins and System Admins can view all tickets
CREATE POLICY "HQ and System Admins view all tickets" ON public.tickets
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('hq_admin', 'system_admin')
        )
    );