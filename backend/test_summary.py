import asyncio
import os
import sys
from pathlib import Path
import requests
import json
import time

# Add the parent directory to the path so we can import the app
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.pdf_processor import pdf_processor
from app.ai_service import ai_service, ExternalLLMConnector, AIService

# Test data
TEST_PDF_PATH = Path("./test_data/sample.pdf")  # Create this directory and add a sample PDF
UPLOAD_ENDPOINT = "http://localhost:8000/upload"
SUMMARIZE_ENDPOINT = "http://localhost:8000/summarize"

async def test_summarize():
    # Get the first PDF from storage
    storage_path = Path("./pdf_storage")
    if not storage_path.exists():
        print("No PDF storage directory found")
        return
    
    pdf_dirs = list(storage_path.iterdir())
    if not pdf_dirs:
        print("No PDFs found in storage")
        return
    
    # Use the first PDF
    pdf_id = pdf_dirs[0].name
    print(f"Testing with PDF ID: {pdf_id}")
    
    try:
        # Extract text
        print("Extracting text...")
        text_by_page = await pdf_processor.extract_text(pdf_id)
        print(f"Text extracted: {sum(len(text) for text in text_by_page.values())} characters")
        
        # Print some sample text
        first_page = list(text_by_page.keys())[0]
        print(f"Sample text from page {first_page}:")
        print(text_by_page[first_page][:200] + "...")
        
        # Try summarization
        print("\nGenerating summary...")
        summary = await ai_service.summarize(pdf_id, text_by_page)
        
        print("\nSUMMARY RESULT:")
        print("=" * 50)
        print(summary)
        print("=" * 50)
        print(f"Summary length: {len(summary)} characters")
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

async def test_external_llm_connector():
    """Test the external LLM connector with a mock provider"""
    print("\n=== Testing External LLM Connector ===")
    
    # Create a connector with mock provider
    connector = ExternalLLMConnector(provider="mock")
    
    # Test for each prompt type
    for prompt_type in ["pdf_analysis", "summarization", "simplification", "mindmap"]:
        print(f"\nTesting {prompt_type} prompt...")
        
        test_query = f"Test query for {prompt_type}"
        test_context = f"This is test context for {prompt_type}.\n" * 10
        
        response = connector.generate_response(test_query, test_context, prompt_type)
        
        print(f"Response length: {len(response)} characters")
        print("Response preview:", response[:150], "..." if len(response) > 150 else "")
        
        if len(response) < 10:
            print("ERROR: Response is too short")
    
    print("\n=== External LLM Testing Complete ===")
    return True

# Main test function
async def run_tests():
    """Run all tests"""
    print("Starting tests...")
    
    await test_summarize()
    await test_external_llm_connector()
    
    print("\nAll tests completed.")

if __name__ == "__main__":
    asyncio.run(run_tests()) 