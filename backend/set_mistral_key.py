import os
import sys

def set_mistral_api_key():
    """Set the Mistral API key in the config file and environment variable"""
    
    # Set environment variable if provided, otherwise prompt for it
    if len(sys.argv) > 1 and sys.argv[1]:
        api_key = sys.argv[1]
    else:
        print("\nPlease enter your Mistral API key: ", end="")
        api_key = input().strip()
    
    if not api_key:
        print("No API key entered. Exiting.")
        return
    
    # Set environment variable
    os.environ["MISTRAL_API_KEY"] = api_key
    print(f"Environment variable MISTRAL_API_KEY set.")
    
    # Update config file
    config_file = 'config.py'
    try:
        with open(config_file, 'r') as f:
            content = f.read()
        
        # Update the API key
        updated_content = content.replace(
            '"mistral": "insert_your_mistral_api_key_here",',
            f'"mistral": "{api_key}",'
        )
        
        with open(config_file, 'w') as f:
            f.write(updated_content)
        
        print(f"Mistral API key has been updated in {config_file}")
        print("You can now use the Mistral API for chat and other features.")
        
    except Exception as e:
        print(f"Error updating config file: {str(e)}")
        print("Please manually update the Mistral API key in config.py")

if __name__ == "__main__":
    set_mistral_api_key() 