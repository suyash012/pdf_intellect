"""
Configuration settings for the AI PDF Analyzer
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base directories
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = os.path.join(BASE_DIR, os.getenv("UPLOAD_DIR", "uploads"))

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

# API settings
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")

# CORS settings
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

# Max upload size
MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", 10485760))  # Default: 10MB

# LLM Provider Config
ENABLE_EXTERNAL_LLM = True  # Enable external LLM
LLM_PROVIDER = "mistral"  # Use Mistral AI

# Mistral Configuration
MISTRAL_MODEL = "mistral-large-latest"  # Model to use with Mistral AI client

# API Keys
LLM_API_KEYS = {
    "openai": "",  # Add your OpenAI API key here
    "huggingface": os.getenv("HUGGINGFACE_API_KEY", ""),  # Your Hugging Face API key
    "mistral": os.getenv("MISTRAL_API_KEY", ""),  # Your Mistral API key
    "custom": ""  # Add your custom provider API key here
}

LLM_ENDPOINTS = {
    "huggingface": "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
    "custom": "http://localhost:5000/generate"
}

# Default prompts - Enhanced for better results
PDF_ANALYSIS_PROMPT = """You are an AI assistant specialized in analyzing PDF documents and providing detailed responses.
Your role is to answer questions about the document content accurately and helpfully.
Always base your responses ONLY on the document content provided - do not include external information.
If the information isn't in the document, clearly state this limitation rather than making up an answer.
Structure your responses in a clear, well-organized format using paragraphs, bullet points, or numbered lists as appropriate.
When referencing specific information, include the page number in the format [Page X].
Your tone should be professional, conversational, and accessible to all users.
"""

SUMMARIZATION_PROMPT = """Create a comprehensive summary of the following document.
Focus on capturing the main ideas, key points, arguments, and essential details.
Organize the summary in a logical flow that follows the document's structure.
Use clear language and concise phrasing while preserving the document's original meaning and context.
Include all important conclusions and recommendations from the document.
Maintain an objective tone throughout the summary.
"""

SIMPLIFICATION_PROMPT = """Simplify the following text to make it more accessible and easier to understand.
Preserve the core meaning, main ideas, and essential details.
Use simpler vocabulary and shorter sentences.
Break down complex concepts into clearer explanations.
Remove unnecessary jargon or technical terms, or explain them when they must be included.
Organize the simplified text in a logical, easy-to-follow structure.
Use active voice where possible and concrete examples to illustrate abstract concepts.
"""

MINDMAP_PROMPT = """Create a comprehensive mind map based on the following document content.
The mind map should be in JSON format with the following structure:
{
  "id": "root",
  "name": "Document Title",
  "children": [
    {
      "id": "topic1",
      "name": "Main Topic 1",
      "children": [
        {
          "id": "topic1-1",
          "name": "Subtopic 1.1"
        }
      ]
    }
  ]
}
Identify and organize the main topics, subtopics, and key points from the document.
Ensure the document title or central theme is the root node.
Include 4-8 main topics that represent the document's most important sections or themes.
Add relevant subtopics to each main topic to show hierarchical relationships.
Create a logical structure that makes the document's organization clear.
Use concise, descriptive phrases for each node (not full sentences).
Only include the most essential information in the mind map structure.
Output ONLY the JSON structure with no additional text or explanation.
"""

# AI Service Configuration
DEFAULT_MODEL = "facebook/bart-large-cnn"  # For Hugging Face
MAX_TOKENS = 1500  # Increased for more detailed responses
TEMPERATURE = 0.3  # Lower temperature for more focused, accurate responses

# Hugging Face Configuration (if used as fallback)
HF_PROVIDER = "inference-api"
HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.1"

# API Rate Limiting
MAX_REQUESTS_PER_MINUTE = 20 