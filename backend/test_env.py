import os
from dotenv import load_dotenv

# Test environment variable loading
load_dotenv()

print("Testing environment variable loading:")
print(f"UPLOAD_DIR: {os.getenv('UPLOAD_DIR', 'Not set')}")
print(f"HOST: {os.getenv('HOST', 'Not set')}")
print(f"PORT: {os.getenv('PORT', 'Not set')}")
print(f"DEBUG: {os.getenv('DEBUG', 'Not set')}")
print(f"CORS_ORIGINS: {os.getenv('CORS_ORIGINS', 'Not set')}")
print(f"MAX_UPLOAD_SIZE: {os.getenv('MAX_UPLOAD_SIZE', 'Not set')}")

# Check if sensitive variables are set (without revealing their values)
mistral_key = os.getenv('MISTRAL_API_KEY', '')
huggingface_key = os.getenv('HUGGINGFACE_API_KEY', '')

print(f"MISTRAL_API_KEY: {'Set' if mistral_key else 'Not set'}")
print(f"HUGGINGFACE_API_KEY: {'Set' if huggingface_key else 'Not set'}")

print("\nNow trying to import config.py:")
try:
    import config
    print("Config imported successfully!")
    print(f"UPLOAD_DIR from config: {config.UPLOAD_DIR}")
    print(f"HOST from config: {config.HOST}")
    print(f"PORT from config: {config.PORT}")
    print(f"DEBUG from config: {config.DEBUG}")
    print(f"CORS_ORIGINS from config: {config.CORS_ORIGINS}")
    print(f"MAX_UPLOAD_SIZE from config: {config.MAX_UPLOAD_SIZE}")
    
    # Check if API keys are properly loaded in config
    print(f"MISTRAL_API_KEY from config: {'Set' if config.LLM_API_KEYS['mistral'] else 'Not set'}")
    print(f"HUGGINGFACE_API_KEY from config: {'Set' if config.LLM_API_KEYS['huggingface'] else 'Not set'}")
except Exception as e:
    print(f"Error importing config: {str(e)}") 