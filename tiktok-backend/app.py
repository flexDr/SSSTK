from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import yt_dlp
import requests
import urllib.parse

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def inicio():
    return "¡El motor de descargas está activo!"

@app.route('/api/descargar', methods=['POST'])
def procesar_video():
    datos = request.get_json()
    tiktok_url = datos.get('url')
    modo = datos.get('modo', 'video')

    if not tiktok_url or 'tiktok.com' not in tiktok_url:
        return jsonify({"error": "Por favor, ingresa un enlace válido de TikTok"}), 400

    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'format': 'best',
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(tiktok_url, download=False)
            
            titulo = info.get('title', 'Video de TikTok')
            miniatura = info.get('thumbnail', '') # AQUÍ EXTRAEMOS LA IMAGEN DE PORTADA
            url_descarga = None
            
            if modo == 'audio':
                formatos = info.get('formats', [])
                for f in formatos:
                    if f.get('acodec') != 'none' and f.get('vcodec') == 'none':
                        url_descarga = f.get('url')
                        break
                if not url_descarga:
                    url_descarga = info.get('url')
            else:
                url_descarga = info.get('url')

            url_segura = urllib.parse.quote(url_descarga, safe='')
            url_puente = f"https://ssstk.onrender.com/api/proxy?url={url_segura}&modo={modo}"

            return jsonify({
                "status": "success",
                "video_titulo": titulo,
                "download_url": url_puente,
                "thumbnail_url": miniatura # ENVIAMOS LA IMAGEN AL FRONTEND
            })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "TikTok bloqueó la petición. Intenta con otro enlace."}), 500

@app.route('/api/proxy', methods=['GET'])
def proxy_descarga():
    url_tiktok = request.args.get('url')
    modo = request.args.get('modo', 'video')
    
    if not url_tiktok:
        return "Falta la URL", 400

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://www.tiktok.com/"
        }
        
        req = requests.get(url_tiktok, stream=True, headers=headers)
        
        extension = "mp3" if modo == "audio" else "mp4"
        mime_type = "audio/mpeg" if modo == "audio" else "video/mp4"

        return Response(
            stream_with_context(req.iter_content(chunk_size=1024*1024)),
            content_type=req.headers.get('content-type', mime_type),
            headers={
                'Content-Disposition': f'attachment; filename="SSSTK_Descarga.{extension}"'
            }
        )
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
