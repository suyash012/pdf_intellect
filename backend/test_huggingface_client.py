import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import config

def test_huggingface_client():
    """Test the Hugging Face client with a simple query"""
    try:
        from huggingface_hub import InferenceClient
        
        # Check if the API key is set
        api_key = config.LLM_API_KEYS.get("huggingface", "")
        if not api_key:
            print("⚠️ No Hugging Face API key set in config.py")
            return
        
        print(f"Using API key: {api_key[:4]}...{api_key[-4:] if len(api_key) > 8 else ''}")
        print(f"Provider: {config.HF_PROVIDER}")
        print(f"Model: {config.HF_MODEL}")
        
        # Create client
        client = InferenceClient(
            provider=config.HF_PROVIDER,
            api_key=api_key,
        )
        
        # Test with a simple question
        messages = [
            {
                "role": "user",
                "content": "What is the capital of France?"
            }
        ]
        
        print("\nSending request to Hugging Face API...")
        completion = client.chat.completions.create(
            model=config.HF_MODEL,
            messages=messages,
            max_tokens=500,
        )
        
        print("\nResponse:")
        print(f"Content: {completion.choices[0].message.content}")
        
    except ImportError:
        print("❌ Error: huggingface_hub library not installed.")
        print("Run: pip install huggingface_hub")
    except Exception as e:
        print(f"❌ Error using Hugging Face client: {str(e)}")

if __name__ == "__main__":
    test_huggingface_client() 