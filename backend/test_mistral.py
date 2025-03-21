import config
from mistralai import Mistral

def test_mistral_api():
    """Test the Mistral AI API with a simple query"""
    
    # Get API key from config
    api_key = config.LLM_API_KEYS.get("mistral")
    
    if not api_key or api_key == "insert_your_mistral_api_key_here":
        print("⚠️ No Mistral API key set in config.py")
        return
    
    model = config.MISTRAL_MODEL
    
    print(f"Using model: {model}")
    print(f"API key: {api_key[:4]}...{api_key[-4:] if len(api_key) > 8 else ''}")
    
    try:
        # Create Mistral client
        client = Mistral(api_key=api_key)
        
        # Make a test query
        print("\nSending request to Mistral API...")
        
        chat_response = client.chat.complete(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": "What is the capital of France?",
                },
            ]
        )
        
        # Print response
        print("\nResponse:")
        print(chat_response.choices[0].message.content)
        
    except Exception as e:
        print(f"❌ Error using Mistral API: {str(e)}")

if __name__ == "__main__":
    test_mistral_api() 