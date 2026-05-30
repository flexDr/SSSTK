from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import requests
import urllib.parse

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def inicio():
    return "¡El motor de descargas está activo con API ultrarrápida!"

@app.route('/api/descargar', methods=['POST'])
def procesar_video():
    datos = request.get_json()
    tiktok_url = datos.get('url')

    if not tiktok_url or 'tiktok.com' not in tiktok_url:
        return jsonify({"error": "Por favor, ingresa un enlace válido de TikTok"}), 400

    try:
        # Usamos la API gratuita de TikWM para obtener el MP3 puro y el Video sin marca
        api_url = f"https://www.tikwm.com/api/?url={tiktok_url}"
        respuesta = requests.get(api_url).json()

        if respuesta.get('code') == 0:
            data = respuesta['data']
            
            titulo = data.get('title', 'Video_TikTok')
            miniatura = data.get('cover', '')
            
            # Aquí obtenemos los enlaces reales separados y limpios
            url_video = data.get('play', '') # Video 100% sin marca de agua
            url_audio = data.get('music', '') # Audio MP3 puro y real

            # Codificamos las URLs para nuestro puente
            url_segura_video = urllib.parse.quote(url_video, safe='')
            url_segura_audio = urllib.parse.quote(url_audio, safe='')

            # Creamos los puentes
            url_puente_mp4 = f"https://ssstk.onrender.com/api/proxy?url={url_segura_video}&modo=video"
            url_puente_mp3 = f"https://ssstk.onrender.com/api/proxy?url={url_segura_audio}&modo=audio"

            return jsonify({
                "status": "success",
                "video_titulo": titulo,
                "thumbnail_url": miniatura,
                "download_url_mp4": url_puente_mp4,
                "download_url_mp3": url_puente_mp3
            })
        else:
            return jsonify({"error": "No se pudo extraer el video. Revisa el enlace."}), 400

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al conectar con los servidores de extracción."}), 500


@app.route('/api/proxy', methods=['GET'])
def proxy_descarga():
    url_tiktok = request.args.get('url')
    modo = request.args.get('modo', 'video')
    
    if not url_tiktok:
        return "Falta la URL", 400

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36"
        }
        
        req = requests.get(url_tiktok, stream=True, headers=headers)
        
        # Le decimos estrictamente al celular qué tipo de archivo es
        if modo == "audio":
            extension = "mp3"
            mime_type = "audio/mpeg"
        else:
            extension = "mp4"
            mime_type = "video/mp4"

        return Response(
            stream_with_context(req.iter_content(chunk_size=1024*1024)),
            content_type=mime_type,
            headers={
                'Content-Disposition': f'attachment; filename="SSSTK_{extension.upper()}.{extension}"'
            }
        )
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
