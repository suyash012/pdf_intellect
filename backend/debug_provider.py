import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import config
from app.ai_service import AIService, ExternalLLMConnector

def debug_provider():
    """Debug which LLM provider is selected"""
    
    print(f"LLM_PROVIDER in config: {config.LLM_PROVIDER}")
    print(f"ENABLE_EXTERNAL_LLM: {config.ENABLE_EXTERNAL_LLM}")
    
    # Check the config first
    for key, value in config.LLM_API_KEYS.items():
        masked_value = f"{value[:4]}...{value[-4:]}" if value and len(value) > 8 else value
        print(f"API key for {key}: {masked_value}")
    
    # Check ExternalLLMConnector initialization
    connector = ExternalLLMConnector()
    print(f"\nExternalLLMConnector provider: {connector.provider}")
    
    # Check AIService initialization
    service = AIService()
    print(f"\nAIService external_llm.provider: {service.external_llm.provider}")
    
    # Try to generate a test response
    print("\nTesting generate_response method:")
    response = service.external_llm.generate_response(
        query="What is 2+2?",
        context="",
        prompt_type="pdf_analysis"
    )
    print(f"Response: {response[:100]}...")

if __name__ == "__main__":
    debug_provider() 