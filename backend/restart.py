"""
Restart script for the PDF Analyzer application.
This script clears any cached data and restarts the server.
"""

import os
import shutil
from pathlib import Path
import sys
import subprocess
import time

def clear_cache():
    """Clear any cached data"""
    # Clear PDF storage cache
    pdf_storage = Path("./pdf_storage")
    if pdf_storage.exists():
        # Don't delete the directory itself, just its contents
        for item in pdf_storage.iterdir():
            if item.is_file():
                item.unlink()
            elif item.is_dir():
                shutil.rmtree(item)
        print("Cleared PDF storage cache")
    
    # Clear Python cache
    pycache = Path("./__pycache__")
    if pycache.exists():
        shutil.rmtree(pycache)
        print("Cleared Python cache")
    
    app_pycache = Path("./app/__pycache__")
    if app_pycache.exists():
        shutil.rmtree(app_pycache)
        print("Cleared app Python cache")

def restart_server():
    """Restart the server"""
    print("Restarting server...")
    
    # Kill any running server process
    if os.name == 'nt':  # Windows
        try:
            subprocess.run(["taskkill", "/f", "/im", "python.exe"], 
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        except Exception as e:
            print(f"Error killing processes: {str(e)}")
    else:  # Linux/Mac
        try:
            subprocess.run(["pkill", "-f", "uvicorn"], 
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        except Exception as e:
            print(f"Error killing processes: {str(e)}")
    
    # Wait a moment
    time.sleep(2)
    
    # Start the server
    print("Starting server...")
    
    # Use the appropriate Python interpreter
    python_cmd = "./venv/Scripts/python" if os.path.exists("./venv/Scripts/python") else "python"
    
    # Start in a new process so it doesn't block
    if os.name == 'nt':  # Windows
        subprocess.Popen(["start", "cmd", "/c", python_cmd, "-m", "app.main"], 
                        shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    else:  # Linux/Mac
        subprocess.Popen([python_cmd, "-m", "app.main"], 
                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    print("Server restarted!")

if __name__ == "__main__":
    print("Starting restart process...")
    clear_cache()
    restart_server()
    print("Done. The server should be running now.")
    print("Please reload your frontend page to connect to the restarted server.") 