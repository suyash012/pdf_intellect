# PDF Intellect

A modern React and FastAPI application for analyzing, visualizing, and extracting insights from PDF documents using advanced generative AI technology.

## Features

### Implemented ✅
- 📄 PDF Upload & Management
- 👤 User Authentication (signup, login, profile management)
- 🔐 Password Management (change password, reset password)
- 🎨 Dark/Light Theme with smooth transitions
- 📱 Responsive Design
- 🔄 Sidebar with recent PDFs and chats
- 💾 Database integration with Supabase
- 📝 AI-Powered Summary Generation
- 💬 AI-Powered Chat with documents
- 🧠 AI-Generated Interactive Mind Maps
- 🔄 AI-Powered Text Simplification

### Coming Soon 🚀
- 📊 Advanced Analytics Dashboard
- 🔍 Enhanced Search Capabilities
- 🌐 Collaborative Document Sharing
- 📱 Mobile Application

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: FastAPI, Python, NLTK
- **Database**: Supabase (Auth, Storage, Database)
- **AI Engine**: Mistral AI API and Hugging Face for generative AI features

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- Python 3.8+
- Supabase account
- Mistral AI API key (for AI features)

### Installation

1. Clone this repository
```bash
git clone https://github.com/yourusername/pdf-intellect.git
cd pdf-intellect
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

4. Create `.env` file in the frontend directory
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Configure the backend
```bash
cd backend
python set_mistral_key.py
```

6. Start the application
```bash
# From project root
./start-all.bat
```

## Backend Features

The backend is built with FastAPI and provides these key features:

- **PDF Processing**: Extract and process text from PDF documents
- **AI Service**: Advanced NLP and LLM integration
  - Text summarization with adjustable complexity levels
  - Interactive document chat with context-aware responses
  - Mind map generation for visual document exploration
  - Text simplification to improve readability
- **Multiple LLM Support**: Integration with Mistral AI and Hugging Face
- **Fallback Mechanisms**: Local processing when API services are unavailable

### API Endpoints

- `/upload` - Upload PDF documents
- `/summarize` - Generate document summaries
- `/chat` - Chat with PDF documents
- `/simplify` - Simplify complex text
- `/generate-mindmap` - Create visual mind maps from documents

## Frontend Components

- **Upload.js** - PDF upload with drag-and-drop functionality
- **PDFViewer.js** - Enhanced PDF viewer with annotation capabilities
- **Sidebar.js** - Navigation sidebar with recent documents and chats
- **Header.js** - Application header with user controls
- **MindMap.js** - Interactive visualization of document concepts
- **Chat.js** - AI-powered document chat interface
- **Summary.js** - Document summary with complexity controls
- **Simplify.js** - Text simplification interface

## Setting Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Create a storage bucket called "pdfs" and set it to private
4. Add storage policy: "Give users access to only their own top level folder named as uid"
5. Run the SQL from `frontend/src/db/schema.sql` in the Supabase SQL editor
6. Configure auth settings to allow email/password signup

## Project Structure

- `/frontend` - React application
  - `/src/components` - React components (UI, Auth, etc.)
  - `/src/utils` - Utility functions and contexts
  - `/src/db` - Database schemas and setup instructions

- `/backend` - FastAPI application
  - `/app` - Main application code
    - `main.py` - API endpoints
    - `ai_service.py` - AI functionality 
    - `pdf_processor.py` - PDF processing utilities
  - `/uploads` - PDF storage directory

## Current Implementation Status

- [x] User authentication flow
- [x] Profile management
- [x] PDF upload and storage
- [x] Database schema with Supabase
- [x] Dark/Light theme toggle
- [x] Responsive sidebar
- [x] PDF viewer implementation
- [x] AI-powered document chat
- [x] AI-generated document summaries
- [x] AI-powered mind map visualization
- [x] AI-based text simplification

## Running the Application

The application can be started using the provided batch files:

- `start-all.bat` - Start both frontend and backend
- `start-frontend.bat` - Start only the frontend
- `start-backend.bat` - Start only the backend

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Supabase](https://supabase.com/)
- [Mistral AI](https://mistral.ai/)
- [NLTK](https://www.nltk.org/)

## Deployment

### Frontend Deployment
- **Vercel**: Ideal for React applications
  ```bash
  npm install -g vercel
  cd frontend
  vercel
  ```
- **Netlify**: Easy deployment with continuous integration
  - Connect your GitHub repository to Netlify
  - Set build command: `cd frontend && npm run build`
  - Set publish directory: `frontend/build`
- **AWS Amplify**: Scalable hosting with AWS infrastructure
  - Connect repository through AWS Amplify Console
  - Follow the setup wizard for React applications

### Backend Deployment
- **Heroku**: Quick deployment with buildpacks
  ```bash
  cd backend
  heroku create
  git push heroku main
  ```
- **Railway**: Simple PaaS for FastAPI applications
  - Connect GitHub repository
  - Set start command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **AWS EC2/ECS**: More control and scalability
  - Deploy using Docker containers
  - Set up load balancing for high availability
- **Google Cloud Run**: Serverless container deployment
  - Create a Dockerfile in the backend directory
  - Deploy with Google Cloud CLI

### Database
Continue using Supabase cloud hosting or migrate to a self-hosted PostgreSQL instance depending on your requirements.

### Environment Configuration
Make sure to configure environment variables on your hosting platform:
- Frontend: `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`, `REACT_APP_API_URL`
- Backend: `MISTRAL_API_KEY`, `DATABASE_URL`, `CORS_ORIGINS` 

## Version Control Guidelines

### What to Commit
- Source code (`.js`, `.jsx`, `.py`, `.tsx`, `.ts` files)
- Configuration files (`.json`, `.yaml`, `.toml`)
- Documentation files (`.md`)
- Asset files (images, icons, fonts)
- Schema files and migrations
- Test files
- CI/CD configuration files

### What NOT to Commit
- Environment files (`.env`, `.env.local`)
- API key files (`mistral_key.txt`, `api_key.txt`)
- Node modules (`node_modules/`)
- Python virtual environments (`venv/`, `env/`)
- Compiled Python files (`__pycache__/`, `*.pyc`)
- Build directories (`build/`, `dist/`)
- Temporary uploads (`uploads/`, `pdf_storage/`)
- Log files (`*.log`)
- System files (`.DS_Store`, `Thumbs.db`)
- IDE-specific files (`.vscode/`, `.idea/`)

### Environment Setup for New Contributors
New contributors should:
1. Create `.env` files based on `.env.example` templates
2. Run `python set_mistral_key.py` to set up API keys
3. Create empty directories for uploads if needed:
   ```bash
   mkdir -p backend/uploads
   mkdir -p backend/pdf_storage
   ``` 