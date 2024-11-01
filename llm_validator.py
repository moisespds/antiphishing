from flask import Flask, request, jsonify
import openai

app = Flask(__name__)
openai.api_key = "sua_chave_openai"

@app.route('/validate_content', methods=['POST'])
def validate_content():
    data = request.json
    url_content = data["content"]

    response = openai.Completion.create(
        model="gpt-3.5-turbo",
        prompt=f"Analise o conteúdo da URL e verifique se corresponde a um site legítimo. Conteúdo: {url_content}",
        max_tokens=50
    )
    
    decision = "Legítimo" if "legítimo" in response.choices[0].text else "Suspeito"
    return jsonify({"result": decision})

if __name__ == '__main__':
    app.run(port=5000)
