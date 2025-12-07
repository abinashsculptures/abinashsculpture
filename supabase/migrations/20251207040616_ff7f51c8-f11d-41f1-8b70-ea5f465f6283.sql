-- Add availability column to products table
ALTER TABLE public.products 
ADD COLUMN availability text NOT NULL DEFAULT 'in_stock' 
CHECK (availability IN ('in_stock', 'out_of_stock'));