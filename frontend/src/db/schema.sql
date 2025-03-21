-- Create PDF table
CREATE TABLE IF NOT EXISTS pdfs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  content_type TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  pdf_id UUID REFERENCES pdfs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_user BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create summaries table
CREATE TABLE IF NOT EXISTS summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pdf_id UUID NOT NULL REFERENCES pdfs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mind maps table
CREATE TABLE IF NOT EXISTS mind_maps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pdf_id UUID NOT NULL REFERENCES pdfs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create simplifications table
CREATE TABLE IF NOT EXISTS simplifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pdf_id UUID NOT NULL REFERENCES pdfs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS (Row Level Security) policies
-- This ensures users can only access their own data

-- PDF policies
ALTER TABLE pdfs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own PDFs" ON pdfs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own PDFs" ON pdfs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own PDFs" ON pdfs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own PDFs" ON pdfs
  FOR DELETE USING (auth.uid() = user_id);

-- Chat policies
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chats" ON chats
  FOR DELETE USING (auth.uid() = user_id);

-- Chat messages policies
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from their chats" ON chat_messages
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM chats WHERE id = chat_messages.chat_id)
  );

CREATE POLICY "Users can insert messages to their chats" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM chats WHERE id = chat_messages.chat_id)
  );

-- Summary policies
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own summaries" ON summaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own summaries" ON summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own summaries" ON summaries
  FOR UPDATE USING (auth.uid() = user_id);

-- Mind map policies
ALTER TABLE mind_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mind maps" ON mind_maps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mind maps" ON mind_maps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mind maps" ON mind_maps
  FOR UPDATE USING (auth.uid() = user_id);

-- Simplification policies
ALTER TABLE simplifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own simplifications" ON simplifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own simplifications" ON simplifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own simplifications" ON simplifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create a function to delete user account
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete user data first (RLS will handle this based on auth.uid())
  DELETE FROM pdfs WHERE user_id = auth.uid();
  DELETE FROM chats WHERE user_id = auth.uid();
  
  -- Delete user from auth schema
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$; 