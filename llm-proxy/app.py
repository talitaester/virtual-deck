from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  

OLLAMA_URL = 'http://localhost:11434/api/generate'
MODEL_NAME = 'llama3'  

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()

    prompt = data.get('prompt')
    if not prompt:
        return jsonify({'error': 'Prompt é obrigatório'}), 400

    response = requests.post(OLLAMA_URL, json={
        'model': MODEL_NAME,
        'prompt': prompt,
        'stream': False
    })

    if response.status_code != 200:
        return jsonify({'error': 'Erro ao se comunicar com o Ollama'}), 500

    output = response.json().get('response', '')
    return jsonify({'response': output})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
