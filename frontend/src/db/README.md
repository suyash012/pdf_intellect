# Database Setup Instructions

This folder contains the SQL schema for setting up the database for the AI PDF Analyzer application. Follow these steps to set up your Supabase database:

## Steps to Apply the Database Schema

1. Log in to your Supabase project at [https://app.supabase.com/](https://app.supabase.com/).

2. Navigate to the SQL Editor by clicking on the "SQL Editor" tab in the sidebar.

3. Click on "New Query" to create a new SQL query.

4. Copy the entire contents of the `schema.sql` file in this directory.

5. Paste the SQL into the query editor in Supabase.

6. Click "Run" to execute the SQL commands and create all the necessary tables, policies, and functions.

## Table Structure

The schema creates the following tables:

- `pdfs`: Stores information about uploaded PDF documents
- `chats`: Stores chat sessions related to PDFs
- `chat_messages`: Stores individual messages within a chat
- `summaries`: Stores generated summaries of PDFs
- `mind_maps`: Stores mind map data generated from PDFs
- `simplifications`: Stores simplified versions of PDFs

Each table has Row Level Security (RLS) policies applied to ensure users can only access their own data.

## Environment Setup

After setting up the database, make sure your application's `.env` file contains the correct Supabase credentials:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing the Database

To test if your database is set up correctly:

1. Try uploading a PDF through the application
2. Check if the PDF appears in the "Recent PDFs" section of the sidebar
3. Start a chat about the PDF and verify it appears in the "Recent Chats" section

If you encounter any issues, check the browser console for error messages related to database queries.

## Storage Setup

For storing actual PDF files, you'll need to configure Supabase Storage:

1. In your Supabase dashboard, go to "Storage" in the sidebar
2. Create a new bucket called "pdfs"
3. Set the bucket privacy to "Private"
4. Add the following policy to allow authenticated users to upload files:

```sql
CREATE POLICY "Users can upload their own PDFs"
ON storage.objects
FOR INSERT
WITH CHECK (auth.uid() = owner);
```

This ensures that PDFs are securely stored and only accessible by their owners. 