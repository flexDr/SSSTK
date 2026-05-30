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
      // ¡Aquí está tu enlace real de Render!
      const response = await fetch('https://ssstk.onrender.com/api/descargar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      setResultado(data);
    } catch (error) {
      console.error("Error al procesar:", error);
      alert("Hubo un error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <header>
        <h1 style={{ color: '#333' }}>Descargador de Videos</h1>
        <p style={{ color: '#666' }}>Obtén tu contenido sin marcas de agua.</p>
      </header>

      {/* Espacio para futuro anuncio de AdSense */}
      <div style={{ height: '90px', backgroundColor: '#f0f0f0', margin: '20px 0', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <small style={{ color: '#aaa' }}>[Espacio para Banner AdSense]</small>
      </div>

      <main>
        <form onSubmit={manejarDescarga}>
          <input
            type="text"
            placeholder="Pega el enlace de TikTok aquí..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            style={{ width: '80%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <br /><br />
          <button
            type="submit"
            disabled={cargando}
            style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: cargando ? '#ccc' : '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: cargando ? 'not-allowed' : 'pointer' }}
          >
            {cargando ? 'Procesando...' : 'Obtener Video'}
          </button>
        </form>

        {/* Muestra el resultado simulado que envía tu backend */}
        {resultado && resultado.status === "success" && (
          <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #4CAF50', borderRadius: '5px', backgroundColor: '#e8f5e9' }}>
            <h3 style={{ color: '#2E7D32' }}>¡Video Listo!</h3>
            <p>{resultado.video_titulo}</p>
            <a
              href={resultado.download_url}
              download
              style={{ display: 'inline-block', marginTop: '10px', padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
            >
              Descargar MP4 de Prueba
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;