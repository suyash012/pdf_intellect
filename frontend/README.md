# PDF Analysis Application

A modern web application for AI-powered PDF analysis, with features like summarization, chat, mind mapping, and text simplification.

## Features

- User authentication with email and password
- Upload and analyze PDF documents
- Interactive PDF viewer
- AI-powered summarization of documents
- Chat with your documents
- Generate mind maps from document content
- Simplify complex text for better understanding
- Dark/light mode support

## Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Supabase account

### Environment Setup

1. Clone this repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```
4. Create a `.env` file in the frontend directory by copying the example:
   ```
   cp .env.example .env
   ```
5. Update the `.env` file with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url_here
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### Supabase Setup

1. Create a new project on [Supabase](https://supabase.com/)
2. Enable Authentication and set up the Email/Password provider
3. Get your project URL and anon key from the project settings
4. Add these credentials to your `.env` file

### Running the Application

```
npm start
```
or
```
yarn start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Authentication Features

- User signup with email and password
- User login
- Password reset
- Protected routes for authenticated users

## Development

### Folder Structure

- `/components` - React components
- `/components/Auth` - Authentication components
- `/utils` - Utility functions and context providers
- `/pages` - Main page components

### Adding Environment Variables

If you need to add more environment variables:

1. Add them to the `.env` file
2. Add them to the `.env.example` file (without real values)
3. Access them in your code with `process.env.REACT_APP_YOUR_VARIABLE`

**Note:** In React, all environment variables must be prefixed with `REACT_APP_` 