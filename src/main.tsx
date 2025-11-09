import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tailwind.css";
import App from "./App.tsx";

// 1. Importa el proveedor de Google
import { GoogleOAuthProvider } from "@react-oauth/google";

// 2. Lee el Client ID desde tu archivo .env del frontend
// (Asegúrate de que tu .env tenga: VITE_GOOGLE_CLIENT_ID=9265...)
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// 3. Verificación de seguridad
if (!googleClientId) {
  throw new Error(
    "¡Error Crítico! Falta VITE_GOOGLE_CLIENT_ID en el archivo .env del frontend."
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 4. Envuelve tu App con el proveedor y pásale el ID */}
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
