import React, { useState } from 'react';
import './App.css'; 

function App() {
  const [url, setUrl] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [modo, setModo] = useState('video'); 

  const manejarDescarga = async (e) => {
    e.preventDefault();
    setCargando(true);
    setResultado(null);

    try {
      const response = await fetch('https://ssstk.onrender.com/api/descargar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      setResultado(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const pegarDelPortapapeles = async () => {
    try {
      const texto = await navigator.clipboard.readText();
      setUrl(texto);
    } catch (err) {
      alert("No se pudo leer el portapapeles. Pega el enlace manualmente.");
    }
  };

  const mostrarAlertaApp = () => {
    alert("¡Nuestra aplicación oficial para celulares estará disponible muy pronto!");
  };

  // Función simple para mostrar los textos legales requeridos por AdSense
  const mostrarLegal = (tipo) => {
    if (tipo === 'privacidad') {
      alert("POLÍTICA DE PRIVACIDAD:\n\nNo almacenamos tus datos personales ni guardamos copias de los videos que descargas. Los archivos se procesan en tiempo real. Utilizamos cookies de terceros (como Google AdSense) para mostrar anuncios personalizados. Al usar nuestra web, aceptas el uso de estas cookies.");
    } else {
      alert("TÉRMINOS DE USO:\n\nEsta herramienta es estrictamente para uso personal. Respetamos los derechos de autor y no nos hacemos responsables del mal uso que los usuarios le den al contenido descargado. No debes usar los videos descargados con fines comerciales sin el permiso del creador original.");
    }
  };

  return (
    <div className="app-main">
      
      <nav className="navbar">
        <div className="logo" onClick={() => setModo('video')} style={{cursor: 'pointer'}}>
          <span>⬇</span> SSSTK
        </div>
        <div className="nav-links">
          <span className={modo === 'video' ? 'activo' : ''} onClick={() => setModo('video')}>
            Video MP4
          </span>
          <span className={modo === 'historia' ? 'activo' : ''} onClick={() => setModo('historia')}>
            Descargar historias
          </span>
          <span className={modo === 'audio' ? 'activo' : ''} onClick={() => setModo('audio')}>
            Descargar audio
          </span>
        </div>
        <button className="nav-btn" onClick={mostrarAlertaApp}>App ➔</button>
      </nav>

      <header className="hero-section">
        <h1>
          {modo === 'video' && 'Descargar videos de TikTok'}
          {modo === 'historia' && 'Descargar historias de TikTok'}
          {modo === 'audio' && 'Descargar audio de TikTok (MP3)'}
        </h1>
        
        <form onSubmit={manejarDescarga}>
          <div className="search-wrapper">
            <input 
              type="text" 
              className="search-input"
              placeholder={
                modo === 'video' ? "Pegar enlace del video..." : 
                modo === 'historia' ? "Pegar enlace de la historia..." : 
                "Pegar enlace para extraer audio MP3..."
              } 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required 
            />
            <button type="button" className="btn-paste" onClick={pegarDelPortapapeles}>
              Pegar
            </button>
            <button type="submit" className="btn-download" disabled={cargando}>
              {cargando ? 'Procesando...' : 'Descargar'}
            </button>
          </div>
        </form>

        <div className="ad-container ad-margin-bottom">
          <span>[Bloque de Anuncio AdSense Premium]</span>
        </div>
      </header>

      <main>
        {resultado && resultado.status === "success" && (
          <div className="result-box-detailed">
            <h3 className="seccion-titulo">Resultado de búsqueda</h3>
            
            <div className="video-preview-container">
              {resultado.thumbnail_url ? (
                <img src={resultado.thumbnail_url} alt="Portada del video" className="video-preview" style={{ borderRadius: '8px' }} />
              ) : (
                <div style={{width: '100%', height: '200px', backgroundColor: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  Sin vista previa
                </div>
              )}
            </div>

            <a href={resultado.download_url_mp4} download className="btn-download-preview">
              Descargar MP4
            </a>
            
            <a href={resultado.download_url_mp3} download className="btn-download-preview btn-audio">
              Descargar MP3
            </a>

            <p className="publicacion-texto">
              {resultado.video_titulo}
            </p>
            
            <div className="post-stats">
              <span>Descarga segura</span>
              <span>100% Gratis</span>
              <span>SSSTK</span>
            </div>
          </div>
        )}

        <div className="ad-container ad-margin-top">
          <span>[Bloque de Anuncio AdSense Secundario]</span>
        </div>
      </main>

      {/* PIE DE PÁGINA OBLIGATORIO PARA GOOGLE ADSENSE */}
      <footer className="footer-legal">
        <p>© 2026 SSSTK. Todos los derechos reservados.</p>
        <div className="footer-links">
          <span onClick={() => mostrarLegal('privacidad')}>Política de Privacidad</span>
          |
          <span onClick={() => mostrarLegal('terminos')}>Términos de Uso</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
