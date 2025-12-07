/*
  # Initial Database Schema for SkillStack Learning Platform

  ## Overview
  This migration creates the complete database schema for the SkillStack learning platform,
  including authentication, course management, user progress tracking, and booklet shop.

  ## New Tables Created

  ### 1. profiles
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text, optional)
  - `avatar_url` (text, optional)
  - `bio` (text, optional)
  - `website` (text, optional)
  - `location` (text, optional)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - Purpose: Extended user profile information

  ### 2. courses
  - `id` (serial, primary key)
  - `title` (text, required)
  - `description` (text, required)
  - `long_description` (text, optional)
  - `price` (decimal, default 0)
  - `image_url` (text, optional)
  - `duration_hours` (integer, required)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - Purpose: Store course information

  ### 3. course_modules
  - `id` (serial, primary key)
  - `course_id` (integer, references courses)
  - `title` (text, required)
  - `description` (text, optional)
  - `order` (integer, required)
  - `created_at` (timestamp)
  - Purpose: Organize course content into modules

  ### 4. course_lessons
  - `id` (serial, primary key)
  - `module_id` (integer, references course_modules)
  - `title` (text, required)
  - `content` (text, required)
  - `video_url` (text, optional)
  - `duration` (integer, required, in seconds)
  - `order` (integer, required)
  - `created_at` (timestamp)
  - Purpose: Store individual lesson content

  ### 5. user_courses
  - `id` (serial, primary key)
  - `user_id` (uuid, references auth.users)
  - `course_id` (integer, references courses)
  - `progress` (integer, default 0)
  - `current_lesson_id` (integer, optional)
  - `enrolled_at` (timestamp)
  - `updated_at` (timestamp)
  - Purpose: Track user course enrollments and progress

  ### 6. user_lessons
  - `id` (serial, primary key)
  - `user_id` (uuid, references auth.users)
  - `course_id` (integer, references courses)
  - `lesson_id` (integer, references course_lessons)
  - `completed_at` (timestamp)
  - Purpose: Track completed lessons

  ### 7. booklets
  - `id` (uuid, primary key)
  - `title` (text, required)
  - `description` (text, optional)
  - `price` (decimal, required)
  - `image_url` (text, optional)
  - `category` (text, optional)
  - `author` (text, optional)
  - `pages` (integer, optional)
  - `file_url` (text, optional)
  - `created_at` (timestamp)
  - Purpose: Store booklet information for the shop

  ### 8. orders
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `status` (text, default 'pending')
  - `total_amount` (decimal, required)
  - `created_at` (timestamp)
  - Purpose: Track user orders

  ### 9. order_items
  - `id` (uuid, primary key)
  - `order_id` (uuid, references orders)
  - `booklet_id` (uuid, references booklets)
  - `quantity` (integer, required)
  - `price` (decimal, required)
  - `created_at` (timestamp)
  - Purpose: Store individual items in each order

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data (profiles, enrollments, orders)
  - Courses, booklets, and lessons are publicly readable
  - Only authenticated users can enroll in courses and place orders

  ## Important Notes
  1. All user-related tables use RLS to ensure data privacy
  2. Course content is publicly accessible for browsing
  3. Enrollment and progress tracking require authentication
  4. Unique constraints prevent duplicate enrollments
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  duration_hours INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create course_modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Course modules are viewable by everyone"
  ON course_modules FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create course_lessons table
CREATE TABLE IF NOT EXISTS course_lessons (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  video_url TEXT,
  duration INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Course lessons are viewable by everyone"
  ON course_lessons FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create user_courses table
CREATE TABLE IF NOT EXISTS user_courses (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  current_lesson_id INTEGER,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments"
  ON user_courses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments"
  ON user_courses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments"
  ON user_courses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user_lessons table
CREATE TABLE IF NOT EXISTS user_lessons (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES course_lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE user_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lesson completions"
  ON user_lessons FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lesson completions"
  ON user_lessons FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create booklets table
CREATE TABLE IF NOT EXISTS booklets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  author TEXT,
  pages INTEGER,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE booklets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Booklets are viewable by everyone"
  ON booklets FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  booklet_id UUID REFERENCES booklets(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_course_id ON user_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_user_lessons_user_id ON user_lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lessons_course_id ON user_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);