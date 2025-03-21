import os
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

class SummaryRequest(BaseModel):
    filename: str
    extract_method: str
    complexity: str

class SummaryResponse(BaseModel):
    summary: str
    status: str
    method: str

@app.post("/summarize", response_model=SummaryResponse)
async def summarize_pdf(request: SummaryRequest):
    """Generate a summary of the PDF"""
    try:
        # First check if we should use cached or new text
        if os.path.exists(UPLOAD_DIR / request.filename):
            file_path = UPLOAD_DIR / request.filename
            
            # Generate summary using AIService
            print(f"Generating {request.complexity} summary with {request.complexity} complexity...")
            
            # Call the AI service summarize method directly without length parameter
            summary = ai_service.summarize(
                pdf_path=str(file_path),
                extract_method=request.extract_method
            )
            
            return {
                "summary": summary, 
                "status": "success",
                "method": request.extract_method
            }
        else:
            return {"summary": "", "status": "error", "method": "No file found"}
            
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"summary": f"Error generating summary: {str(e)}", "status": "error", "method": request.extract_method} 