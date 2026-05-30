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

  return (
    <>
      <div className="app-container">
        <header className="header">
          <h1>Descargador de Videos</h1>
          <p>Obtén tu contenido en alta calidad y sin marcas de agua.</p>
        </header>

        {/* Espacio reservado para AdSense */}
        <div className="ad-space">
          <span>Publicidad AdSense (728x90)</span>
        </div>

        <main>
          <form className="download-form" onSubmit={manejarDescarga}>
            <input
              type="text"
              className="input-url"
              placeholder="Pega el enlace de TikTok aquí..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button type="submit" className="btn-submit" disabled={cargando}>
              {cargando ? 'Procesando...' : 'Obtener Video'}
            </button>
          </form>

          {resultado && resultado.status === "success" && (
            <div className="result-box">
              <h3>¡Video Listo!</h3>
              <p>{resultado.video_titulo}</p>
              <a href={resultado.download_url} download className="btn-download">
                Descargar MP4
              </a>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
