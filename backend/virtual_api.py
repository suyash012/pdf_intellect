import json
from flask import Flask, request, jsonify
import time
import random

# Create Flask app
app = Flask(__name__)

# Sample responses for different queries
SAMPLE_RESPONSES = {
    "what is the capital of france": "The capital of France is Paris.",
    "summarize": "AI systems are complex software typically developed and used in distributed systems involving multiple organizations. The long-term vision is for AI systems to be beneficial to humanity, with AI alignment research ensuring AI systems align with human values and intentions.",
    "default": "I'm a virtual Hugging Face API for testing purposes. This is a placeholder response."
}

@app.route("/v1/chat/completions", methods=["POST"])
def chat_completions():
    """Simulate Hugging Face chat completions API"""
    try:
        # Get request data
        data = request.json
        messages = data.get("messages", [])
        
        # Extract the last user message
        user_message = ""
        for msg in reversed(messages):
            if msg.get("role") == "user":
                user_message = msg.get("content", "").lower()
                break
        
        # Simulate processing time
        time.sleep(0.5)
        
        # Select a response based on user message content
        response_text = SAMPLE_RESPONSES["default"]
        
        if "capital of france" in user_message:
            response_text = SAMPLE_RESPONSES["what is the capital of france"]
        elif "summarize" in user_message:
            response_text = SAMPLE_RESPONSES["summarize"]
        
        # Create response in the format expected by the client
        response = {
            "id": f"chatcmpl-{random.randint(1000, 9999)}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": data.get("model", "Qwen/QwQ-32B"),
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": response_text
                    },
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": len(user_message.split()),
                "completion_tokens": len(response_text.split()),
                "total_tokens": len(user_message.split()) + len(response_text.split())
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Starting virtual Hugging Face API server on http://localhost:8080")
    app.run(host="0.0.0.0", port=8080, debug=True) 