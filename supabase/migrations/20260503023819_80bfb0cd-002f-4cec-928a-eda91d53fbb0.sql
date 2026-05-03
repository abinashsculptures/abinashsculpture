
-- Fix has_role search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$function$;

-- order_requests: replace permissive ALL policy with admin-only SELECT/UPDATE/DELETE
DROP POLICY IF EXISTS "Allow authenticated users to view all submissions" ON public.order_requests;
CREATE POLICY "Admins can view order requests" ON public.order_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update order requests" ON public.order_requests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete order requests" ON public.order_requests
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- works: restrict mutations to admins
DROP POLICY IF EXISTS "Authenticated users can create works" ON public.works;
DROP POLICY IF EXISTS "Authenticated users can update works" ON public.works;
DROP POLICY IF EXISTS "Authenticated users can delete works" ON public.works;
CREATE POLICY "Admins can create works" ON public.works
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update works" ON public.works
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete works" ON public.works
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- sales: restrict mutations and full-list view to admins
DROP POLICY IF EXISTS "Authenticated users can create sales" ON public.sales;
DROP POLICY IF EXISTS "Authenticated users can update sales" ON public.sales;
DROP POLICY IF EXISTS "Authenticated users can delete sales" ON public.sales;
DROP POLICY IF EXISTS "Authenticated users can view all sales" ON public.sales;
CREATE POLICY "Admins can create sales" ON public.sales
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update sales" ON public.sales
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete sales" ON public.sales
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all sales" ON public.sales
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
