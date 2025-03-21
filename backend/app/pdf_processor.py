import os
import uuid
from typing import List, Dict, Optional, Tuple
import PyPDF2
import re
from pathlib import Path
import pytesseract
from PIL import Image
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize

# Download NLTK data if needed
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

# In a production app, you might use a proper db
STORAGE_PATH = Path("./pdf_storage")
STORAGE_PATH.mkdir(exist_ok=True)

class PDFProcessor:
    def __init__(self):
        pass

    async def save_pdf(self, file_content: bytes, filename: str) -> str:
        """Save uploaded PDF and return a unique ID"""
        pdf_id = str(uuid.uuid4())
        
        # Create directory for this PDF
        pdf_dir = STORAGE_PATH / pdf_id
        pdf_dir.mkdir(exist_ok=True)
        
        # Save original PDF
        pdf_path = pdf_dir / "original.pdf"
        with open(pdf_path, "wb") as f:
            f.write(file_content)
            
        # Save metadata
        with open(pdf_dir / "metadata.txt", "w") as f:
            f.write(f"Original filename: {filename}\n")
            
        return pdf_id
        
    async def extract_text(self, pdf_id: str) -> Dict[int, str]:
        """Extract text from PDF pages with improved handling"""
        pdf_path = STORAGE_PATH / pdf_id / "original.pdf"
        
        if not pdf_path.exists():
            raise FileNotFoundError(f"PDF with ID {pdf_id} not found")
            
        text_by_page = {}
        has_ocr_note = False
        
        # Check if we already have cached text content
        text_path = STORAGE_PATH / pdf_id / "text_content.txt"
        if text_path.exists():
            print("Using cached text content")
            with open(text_path, "r", encoding="utf-8") as f:
                content = f.read()
                
            # Parse the content back into the text_by_page dictionary
            current_page = None
            current_text = []
            
            for line in content.split('\n'):
                if line.startswith('--- PAGE '):
                    # Save previous page if any
                    if current_page is not None and current_text:
                        text_by_page[current_page] = '\n'.join(current_text)
                        current_text = []
                    
                    # Extract new page number
                    try:
                        current_page = int(line.replace('--- PAGE ', '').replace(' ---', ''))
                    except ValueError:
                        continue
                elif current_page is not None:
                    current_text.append(line)
            
            # Add the last page
            if current_page is not None and current_text:
                text_by_page[current_page] = '\n'.join(current_text)
                
            # If we successfully loaded cached text, return it
            if text_by_page:
                return text_by_page
        
        try:
            # Try extracting text with PyPDF2
            with open(pdf_path, "rb") as file:
                reader = PyPDF2.PdfReader(file)
                
                # Check if PDF is encrypted
                if reader.is_encrypted:
                    try:
                        reader.decrypt('')  # Try empty password
                    except:
                        raise Exception("PDF is encrypted and cannot be decrypted")
                
                total_text_length = 0
                for i, page in enumerate(reader.pages):
                    try:
                        text = page.extract_text()
                        
                        # Clean up the extracted text
                        if text:
                            text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
                            text = text.strip()
                            
                            # Additional cleaning: remove page numbers and headers/footers
                            # Remove lines that are just page numbers
                            text = re.sub(r'^(\d+)$', '', text, flags=re.MULTILINE)
                            # Remove common header/footer patterns
                            text = re.sub(r'^(Page \d+ of \d+)$', '', text, flags=re.MULTILINE)
                        
                        # If page has very little text, it might be scanned or contain mostly images
                        if not text or len(text) < 100:
                            print(f"Page {i+1} has little text, might be scanned or contain images")
                            text = f"[OCR would process page {i+1}]"
                            has_ocr_note = True
                            
                        text_by_page[i+1] = text
                        total_text_length += len(text)
                        
                    except Exception as e:
                        print(f"Error extracting text from page {i+1}: {str(e)}")
                        text_by_page[i+1] = f"[Error extracting text from page {i+1}]"
            
            # If total extracted text is very small, the PDF might be mostly scanned
            # Try using a better extraction method or OCR in a real application
            if total_text_length < 1000 and has_ocr_note:
                print("PDF appears to be mostly scanned or image-based. Limited text extraction.")
                # In a production app, you would use OCR here
                
                # For now, add a placeholder explanation
                placeholder = "This PDF appears to contain mostly scanned content or images. "
                placeholder += "Limited text could be extracted without OCR. "
                placeholder += "The extracted content may not represent the full document."
                
                # Add as first page note
                first_page = min(text_by_page.keys())
                text_by_page[first_page] = placeholder + "\n\n" + text_by_page[first_page]
                        
            # Cache the extracted text
            with open(text_path, "w", encoding="utf-8") as f:
                for page_num, text in sorted(text_by_page.items()):
                    f.write(f"--- PAGE {page_num} ---\n{text}\n\n")
                    
            return text_by_page
            
        except Exception as e:
            print(f"Error processing PDF: {str(e)}")
            raise Exception(f"Failed to extract text from PDF: {str(e)}")
        
    async def get_page_count(self, pdf_id: str) -> int:
        """Get the total number of pages in the PDF"""
        pdf_path = STORAGE_PATH / pdf_id / "original.pdf"
        
        if not pdf_path.exists():
            raise FileNotFoundError(f"PDF with ID {pdf_id} not found")
            
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            return len(reader.pages)
            
    async def extract_key_entities(self, pdf_id: str) -> Dict[str, List[Dict]]:
        """Extract key entities for mind mapping"""
        text_path = STORAGE_PATH / pdf_id / "text_content.txt"
        
        if not text_path.exists():
            # If text not extracted yet, do it now
            await self.extract_text(pdf_id)
            
        with open(text_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Simple extraction of potential key terms using regex
        # This is a very basic approach compared to spaCy's NER
        entities = {}
        
        # Look for capitalized phrases that might be important terms
        cap_phrases = re.findall(r'\b[A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)*\b', content)
        if cap_phrases:
            entities["KEY_TERMS"] = []
            for phrase in cap_phrases:
                if len(phrase) > 3 and phrase not in ["The", "This", "That", "These", "Those"]:
                    # Check if already in the list
                    if phrase not in [e["text"] for e in entities["KEY_TERMS"]]:
                        entities["KEY_TERMS"].append({
                            "text": phrase,
                            "count": 1
                        })
                    else:
                        # Increment count for duplicate entities
                        for e in entities["KEY_TERMS"]:
                            if e["text"] == phrase:
                                e["count"] += 1
                                break
        
        # Look for numbers that might be significant
        numbers = re.findall(r'\b\d+(?:\.\d+)?%?\b', content)
        if numbers:
            entities["NUMBERS"] = []
            for num in numbers:
                if num not in [e["text"] for e in entities["NUMBERS"]]:
                    entities["NUMBERS"].append({
                        "text": num,
                        "count": 1
                    })
                else:
                    for e in entities["NUMBERS"]:
                        if e["text"] == num:
                            e["count"] += 1
                            break
        
        return entities

# Singleton instance
pdf_processor = PDFProcessor() 