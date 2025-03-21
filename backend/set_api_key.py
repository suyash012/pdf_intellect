import os

def set_huggingface_api_key():
    """Set the Hugging Face API key in the config file"""
    config_file = 'config.py'
    
    # Read the current config file
    with open(config_file, 'r') as f:
        content = f.read()
    
    # Prompt for the API key
    print("\nPlease enter your Hugging Face API key (starts with hf_): ", end='')
    api_key = input().strip()
    
    # Validate the API key format
    if not api_key.startswith('hf_'):
        print("Warning: Hugging Face API keys typically start with 'hf_'")
        print("Are you sure this is correct? (y/n): ", end='')
        confirm = input().strip().lower()
        if confirm != 'y':
            print("API key not updated. Exiting.")
            return
    
    # Update the config file
    updated_content = content.replace(
        '"huggingface": "hf_virtual_api_key",',
        f'"huggingface": "{api_key}",'
    )
    
    # Write the updated config
    with open(config_file, 'w') as f:
        f.write(updated_content)
    
    print(f"Hugging Face API key has been updated in {config_file}")
    print("You can now use the Hugging Face API for chat and other features.")

if __name__ == "__main__":
    set_huggingface_api_key() 