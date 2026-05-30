import React, { useState } from 'react';
import './App.css'; 

function App() {
  const [url, setUrl] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [modo, setModo] = useState('video'); // Opciones: 'video', 'historia', 'audio'

  const manejarDescarga = async (e) => {
    e.preventDefault();
    setCargando(true);
    setResultado(null);

    try {
      // Enviamos el "modo" para que el backend sepa qué extraer.
      // Actualicé la estructura de datos simulada para mostrar vista previa, estadísticas, etc.
      const response = await fetch('https://ssstk.onrender.com/api/descargar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, modo })
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

  return (
    <div className="app-main">
      
      <nav className="navbar">
        <div className="logo" onClick={() => setModo('video')} style={{cursor: 'pointer'}}>
          <span>⬇</span> SSSTK
        </div>
        <div className="nav-links">
          <span 
            className={modo === 'video' ? 'activo' : ''} 
            onClick={() => setModo('video')}
          >
            Video MP4
          </span>
          <span 
            className={modo === 'historia' ? 'activo' : ''} 
            onClick={() => setModo('historia')}
          >
            Descargar historias
          </span>
          <span 
            className={modo === 'audio' ? 'activo' : ''} 
            onClick={() => setModo('audio')}
          >
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
            <button 
              type="button" 
              className="btn-paste" 
              onClick={pegarDelPortapapeles}
            >
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
            
            {/* Vista previa de video con controles */}
            <div className="video-preview-container">
              <video className="video-preview" controls>
                <source src={resultado.download_url} type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
            </div>

            {/* Botón de descarga azul grande y claro */}
            <a href={resultado.download_url} download className="btn-download-preview">
              Descargar {modo === 'audio' ? 'MP3' : 'MP4'}
            </a>

            {/* Texto de la publicación simulado */}
            <p className="publicacion-texto">
              {resultado.titulo}
            </p>
            
            {/* Estadísticas simuladas */}
            <div className="post-stats">
              <span>Hace 1 hora</span>
              <span>3538 likes</span>
              <span>312 comentarios</span>
            </div>
          </div>
        )}

        <div className="ad-container ad-margin-top">
          <span>[Bloque de Anuncio AdSense Secundario]</span>
        </div>
      </main>
    </div>
  );
}

export default App;
