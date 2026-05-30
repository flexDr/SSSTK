from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def inicio():
    return "¡El motor de descargas reales está funcionando!"

@app.route('/api/descargar', methods=['POST'])
def procesar_video():
    datos = request.get_json()
    tiktok_url = datos.get('url')
    modo = datos.get('modo', 'video')

    # Validar que sea un enlace de TikTok
    if not tiktok_url or 'tiktok.com' not in tiktok_url:
        return jsonify({"error": "Por favor, ingresa un enlace válido de TikTok"}), 400

    # Configuración del extractor para engañar a los bloqueos
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'format': 'best', # Busca la mejor calidad disponible
    }

    try:
        # Aquí Python entra a TikTok y saca los datos reales
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(tiktok_url, download=False)
            
            titulo = info.get('title', 'Video de TikTok')
            url_descarga = None
            
            # Si el usuario pidió audio, buscamos el archivo MP3/M4A
            if modo == 'audio':
                formatos = info.get('formats', [])
                for f in formatos:
                    if f.get('acodec') != 'none' and f.get('vcodec') == 'none':
                        url_descarga = f.get('url')
                        break
                if not url_descarga:
                    url_descarga = info.get('url') # Respaldo
            
            # Si el usuario pidió video o historia, sacamos el MP4
            else:
                url_descarga = info.get('url')

            return jsonify({
                "status": "success",
                "video_titulo": titulo,
                "download_url": url_descarga
            })

    except Exception as e:
        print(f"Error interno: {e}")
        return jsonify({"error": "TikTok bloqueó la petición temporalmente o el enlace es privado."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
