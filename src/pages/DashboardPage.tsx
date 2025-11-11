import React, { useState, useEffect } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

// 1. Define la forma de los datos que esperamos de TU backend
interface EmbedConfig {
  accessToken: string;
  embedUrl: string;
  reportId: string;
}

const DashboardPage: React.FC = () => {
  const [embedConfig, setEmbedConfig] = useState<EmbedConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 2. useEffect para pedir el token a TU backend cuando la página carga
  useEffect(() => {
    const fetchEmbedToken = async () => {
      try {
        // 1. Obtenemos el token de admin guardado en el localStorage
        //    (¡Asegúrate de que 'adminToken' sea el nombre que usaste al hacer login!)
        const token = localStorage.getItem('adminToken'); 

        if (!token) {
          setError('No estás autenticado como administrador. Por favor, inicia sesión.');
          return; // Detiene la ejecución si no hay token
        }

        const response = await fetch('http://localhost:4000/api/v1/dashboard/token', {
          method: 'GET',
          // 2. Enviamos el token en los headers para que el "guardián" nos deje pasar
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }); 
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('No autorizado. Tu sesión de admin puede haber expirado.');
          }
          throw new Error('No se pudo obtener el token (Error del servidor).');
        }
        
        const config = await response.json();
        setEmbedConfig(config);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchEmbedToken();
  }, []); // El array vacío [] asegura que solo se ejecute 1 vez
  
  // --- Renderizado ---
  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!embedConfig) {
    return <div className="p-8 text-center">Cargando Dashboard de Power BI...</div>;
  }

  // 3. ¡El Visor de Power BI!
  return (
    // 'h-screen' hace que ocupe toda la altura de la pantalla
    <div className="w-full h-screen">
      <PowerBIEmbed
        embedConfig={{
          type: 'report',
          id: embedConfig.reportId,
          embedUrl: embedConfig.embedUrl,
          accessToken: embedConfig.accessToken,
          tokenType: models.TokenType.Embed, // ¡Importante!
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: true
              }
            },
            background: models.BackgroundType.Transparent,
          }
        }}
        cssClassName="w-full h-full"
      />
    </div>
  );
};

export default DashboardPage;