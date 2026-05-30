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
            miniatura = info.get('thumbnail', '') 
            
            # Extraemos el video por defecto
            url_video = info.get('url')
            
            # Buscamos específicamente el formato de solo audio
            url_audio = None
            for f in info.get('formats', []):
                if f.get('acodec') != 'none' and f.get('vcodec') == 'none':
                    url_audio = f.get('url')
                    break
            
            # Si por alguna razón no hay pista de solo audio, usamos el video como respaldo
            if not url_audio:
                url_audio = url_video 

            # Codificamos AMBAS URLs
            url_segura_video = urllib.parse.quote(url_video, safe='')
            url_segura_audio = urllib.parse.quote(url_audio, safe='')
            
            # Creamos los dos puentes
            url_puente_mp4 = f"https://ssstk.onrender.com/api/proxy?url={url_segura_video}&modo=video"
            url_puente_mp3 = f"https://ssstk.onrender.com/api/proxy?url={url_segura_audio}&modo=audio"

            # Enviamos ambos enlaces a la página web
            return jsonify({
                "status": "success",
                "video_titulo": titulo,
                "thumbnail_url": miniatura,
                "download_url_mp4": url_puente_mp4,
                "download_url_mp3": url_puente_mp3
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
