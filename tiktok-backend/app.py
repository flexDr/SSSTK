from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite que nuestro frontend en React se conecte sin errores


@app.route('/api/descargar', methods=['POST'])
def procesar_video():
    datos = request.get_json()
    tiktok_url = datos.get('url')

    if not tiktok_url:
        return jsonify({"error": "Por favor, ingresa un enlace válido"}), 400

    # Aquí conectaremos el script o la API de terceros (ej. RapidAPI)
    # que se encarga de quitar la marca de agua.

    # Respuesta simulada por ahora:
    respuesta_simulada = {
        "status": "success",
        "video_titulo": "Video Viral",
        "download_url": "https://ejemplo.com/video_limpio.mp4"
    }

    return jsonify(respuesta_simulada)


if __name__ == '__main__':
    app.run(debug=True, port=5000)