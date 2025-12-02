-- Create booklets table
CREATE TABLE IF NOT EXISTS public.booklets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  author TEXT,
  pages INTEGER,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.booklets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE OR REPLACE POLICY "Enable read access for all users" 
ON public.booklets
FOR SELECT 
USING (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  booklet_id UUID REFERENCES public.booklets(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE POLICY "Users can view their own orders" 
ON public.orders
FOR SELECT 
USING (auth.uid() = user_id);

-- Enable RLS for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE POLICY "Users can view their own order items" 
ON public.order_items
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE public.orders.id = order_items.order_id 
  AND public.orders.user_id = auth.uid()
));

-- Insert sample booklets
INSERT INTO public.booklets (title, description, price, image_url, category, author, pages)
VALUES 
  ('Introduction to React', 'Learn the basics of React.js with practical examples', 19.99, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', 'Programming', 'John Doe', 120),
  ('Advanced JavaScript Patterns', 'Master advanced JavaScript patterns and best practices', 24.99, 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', 'Programming', 'Jane Smith', 150),
  ('Data Structures & Algorithms', 'Comprehensive guide to data structures and algorithms', 29.99, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', 'Computer Science', 'Alex Johnson', 200),
  ('Web Design Principles', 'Learn modern web design principles and best practices', 22.99, 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', 'Design', 'Sarah Williams', 95),
  ('Python for Data Science', 'Introduction to data analysis and visualization with Python', 27.99, 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', 'Data Science', 'Michael Brown', 180),
  ('Mobile App Development', 'Build cross-platform mobile applications', 34.99, 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', 'Mobile', 'Emily Davis', 210);

-- Create a function to handle order creation
CREATE OR REPLACE FUNCTION public.create_order(user_id UUID, items JSONB)
RETURNS UUID AS $$
DECLARE
  order_id UUID;
  item RECORD;
  total DECIMAL(10,2) := 0;
  item_price DECIMAL(10,2);
BEGIN
  -- Calculate total amount
  FOR item IN SELECT * FROM jsonb_array_elements(items) AS i
  LOOP
    SELECT price INTO item_price FROM public.booklets WHERE id = (item->>'booklet_id')::UUID;
    total := total + (item_price * (item->>'quantity')::INTEGER);
  END LOOP;
  
  -- Create order
  INSERT INTO public.orders (user_id, total_amount, status)
  VALUES (user_id, total, 'pending')
  RETURNING id INTO order_id;
  
  -- Add order items
  FOR item IN SELECT * FROM jsonb_array_elements(items) AS i
  LOOP
    SELECT price INTO item_price FROM public.booklets WHERE id = (item->>'booklet_id')::UUID;
    
    INSERT INTO public.order_items (order_id, booklet_id, quantity, price)
    VALUES (
      order_id,
      (item->>'booklet_id')::UUID,
      (item->>'quantity')::INTEGER,
      item_price
    );
  END LOOP;
  
  RETURN order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.create_order(UUID, JSONB) TO authenticated;

-- Create a view for user's cart
CREATE OR REPLACE VIEW public.user_cart AS
SELECT 
  u.id as user_id,
  b.id as booklet_id,
  b.title,
  b.price,
  b.image_url,
  COUNT(*) as quantity
FROM 
  auth.users u,
  public.booklets b
WHERE 
  u.id = auth.uid()
GROUP BY 
  u.id, b.id, b.title, b.price, b.image_url;

-- Grant read access to the view
GRANT SELECT ON public.user_cart TO authenticated;
