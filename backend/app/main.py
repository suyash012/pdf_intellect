from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
import asyncio
import os
import traceback
from pathlib import Path

# Use absolute imports instead of relative
from app.pdf_processor import pdf_processor
from app.ai_service import ai_service

app = FastAPI(title="PDF Intellect API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Define upload directory - use an absolute path to ensure consistency
base_dir = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOAD_DIR = base_dir / "uploads"  # Changed from "pdf_storage" to "uploads"
print(f"Setting upload directory to: {UPLOAD_DIR}")
if not UPLOAD_DIR.exists():
    print(f"Creating upload directory: {UPLOAD_DIR}")
    UPLOAD_DIR.mkdir(parents=True)

# Update the upload_dir in ai_service to match
ai_service.upload_dir = str(UPLOAD_DIR)
print(f"AI service upload directory set to: {ai_service.upload_dir}")

# Mount static file handlers
app.mount("/pdfs", StaticFiles(directory=str(UPLOAD_DIR)), name="pdfs")

class SummaryRequest(BaseModel):
    filename: str
    complexity: Optional[str] = "standard"  # "simplified", "standard", or "technical"
    max_length: Optional[int] = None  # Maximum length in words
    extract_method: str = "hybrid"
    length: Optional[str] = "medium"
    pdf_id: Optional[str] = None

class ChatRequest(BaseModel):
    filename: str
    message: str
    extract_method: str = "hybrid"
    pdf_id: Optional[str] = None

class LanguageConversionRequest(BaseModel):
    pdf_id: str
    page_numbers: Optional[List[int]] = None  # If None, convert entire document

class SimplifyRequest(BaseModel):
    filename: str
    text: str
    extract_method: str = "hybrid"

class MindmapRequest(BaseModel):
    filename: str
    extract_method: str = "hybrid"

@app.get("/")
async def root():
    return {"message": "Welcome to PDF Intellect API"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload a PDF file for analysis"""
    try:
        # Generate a safe filename
        filename = file.filename.replace(" ", "_")
        file_path = UPLOAD_DIR / filename
        
        # Create the output file
        with open(file_path, "wb") as output_file:
            # Read the uploaded file in chunks to avoid loading large files into memory
            while content := await file.read(1024 * 1024):  # 1MB chunks
                output_file.write(content)
        
        return {
            "filename": filename,
            "status": "success",
            "message": f"File {filename} uploaded successfully"
        }
    except Exception as e:
        print(f"Error uploading file: {str(e)}")
        traceback.print_exc()
        return {"status": "error", "message": str(e)}

@app.post("/summarize")
def summarize_pdf(request: SummaryRequest):
    try:
        # Check if file exists
        file_path = os.path.join(UPLOAD_DIR, request.filename)
        if not os.path.exists(file_path):
            return {"success": False, "error": f"File not found: {request.filename}"}
            
        # Call AI service to get summary
        summary = ai_service.summarize(
            filename=request.filename,
            complexity=request.complexity,
            max_length=request.max_length
        )
        
        return {
            "success": True,
            "summary": summary,
            "filename": request.filename,
            "complexity": request.complexity
        }
        
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        traceback.print_exc()
        return {"success": False, "error": str(e)}

@app.post("/chat")
async def chat_with_pdf(request: ChatRequest):
    """Chat with the AI about a PDF document"""
    try:
        if not os.path.exists(UPLOAD_DIR / request.filename):
            return {"response": "PDF file not found", "status": "error"}
        
        file_path = UPLOAD_DIR / request.filename
        
        # Process the chat query
        response = ai_service.chat(
            prompt=request.message,
            pdf_path=str(file_path),
            extract_method=request.extract_method
        )
        
        return {"response": response, "status": "success"}
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        traceback.print_exc()
        return {"response": f"Error processing chat: {str(e)}", "status": "error"}

@app.post("/simplify")
async def simplify_language(request: SimplifyRequest):
    """Simplify text from the PDF or provided text"""
    try:
        # If text is provided directly, simplify it
        if request.text:
            simplified = ai_service.simplify(request.text)
            return {"simplified": simplified, "status": "success"}
        
        # Otherwise get text from the PDF file
        if not os.path.exists(UPLOAD_DIR / request.filename):
            return {"simplified": "PDF file not found", "status": "error"}
        
        file_path = UPLOAD_DIR / request.filename
        
        # Extract text and then simplify it
        text = ai_service.extract_text(str(file_path), request.extract_method)
        simplified = ai_service.simplify(text)
        
        return {"simplified": simplified, "status": "success"}
    except Exception as e:
        print(f"Error in simplify endpoint: {str(e)}")
        traceback.print_exc()
        return {"simplified": f"Error simplifying text: {str(e)}", "status": "error"}

@app.post("/generate-mindmap")
async def generate_mindmap(request: MindmapRequest):
    """Generate a mindmap from the PDF document"""
    try:
        if not os.path.exists(UPLOAD_DIR / request.filename):
            return {"success": False, "error": "PDF file not found"}
        
        file_path = UPLOAD_DIR / request.filename
        
        # Generate the mindmap
        mindmap = ai_service.create_mindmap(
            pdf_path=str(file_path),
            extract_method=request.extract_method
        )
        
        return {
            "success": True,
            "mindmap": mindmap
        }
    except Exception as e:
        print(f"Error generating mindmap: {str(e)}")
        traceback.print_exc()
        return {"success": False, "error": f"Error generating mindmap: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 