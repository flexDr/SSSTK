from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Habilita CORS para permitir que tu frontend en Vercel se comunique con este backend
CORS(app) 

# Ruta principal para verificar que el servidor está vivo (evita el error 404)
@app.route('/', methods=['GET'])
def inicio():
    return "¡El motor de descargas está funcionando correctamente en Render!"

# Ruta de la API que procesará las descargas
@app.route('/api/descargar', methods=['POST'])
def procesar_video():
    datos = request.get_json()
    tiktok_url = datos.get('url')

    if not tiktok_url:
        return jsonify({"error": "Por favor, ingresa un enlace válido"}), 400

    # Aquí conectaremos el script o la API real más adelante.
    # Por ahora, enviamos la respuesta simulada para probar la conexión con React.
    respuesta_simulada = {
        "status": "success",
        "video_titulo": "Video Viral de Prueba",
        "download_url": "https://www.w3schools.com/html/mov_bbb.mp4" # URL de video MP4 real para pruebas
    }
    
    return jsonify(respuesta_simulada)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
