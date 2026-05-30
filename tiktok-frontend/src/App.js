import React, { useState } from 'react';
import './App.css'; 

function App() {
  const [url, setUrl] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

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

  // Función para el botón de "Pegar"
  const pegarDelPortapapeles = async () => {
    try {
      const texto = await navigator.clipboard.readText();
      setUrl(texto);
    } catch (err) {
      alert("No se pudo leer el portapapeles. Pega el enlace manualmente.");
    }
  };

  return (
    <div className="app-main">
      
      {/* Barra de Navegación idéntica al ejemplo */}
      <nav className="navbar">
        <div className="logo">
          <span>⬇</span> SSSTK
        </div>
        <div className="nav-links">
          <span>Descargar historias de TikTok</span>
          <span>Descargar audio de TikTok</span>
        </div>
        <button className="nav-btn">App ➔</button>
      </nav>

      {/* Sección Púrpura de Búsqueda */}
      <header className="hero-section">
        <h1>Descargar videos de TikTok</h1>
        
        <form onSubmit={manejarDescarga}>
          <div className="search-wrapper">
            <input 
              type="text" 
              className="search-input"
              placeholder="Pegar enlace" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required 
            />
            <button 
              type="button" 
              className="btn-paste" 
              onClick={pegarDelPortapapeles}
            >
              📋 Pegar
            </button>
            <button type="submit" className="btn-download" disabled={cargando}>
              {cargando ? 'Procesando...' : 'Descargar'}
            </button>
          </div>
        </form>

        {/* Banner AdSense principal (El que más paga) */}
        <div className="ad-container ad-margin-bottom">
          <span>[Bloque de Anuncio AdSense Premium]</span>
        </div>
      </header>

      {/* Resultados de descarga */}
      <main>
        {resultado && resultado.status === "success" && (
          <div className="result-box">
            <h3>¡Video Listo!</h3>
            <p>{resultado.video_titulo}</p>
            <a href={resultado.download_url} download className="btn-final-download">
              Descargar MP4 sin marca de agua
            </a>
          </div>
        )}

        {/* Banner AdSense inferior */}
        <div className="ad-container ad-margin-top">
          <span>[Bloque de Anuncio AdSense Secundario]</span>
        </div>
      </main>

    </div>
  );
}

export default App;
