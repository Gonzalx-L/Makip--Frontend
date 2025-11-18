import React, { useEffect, useRef } from "react";

interface GoogleLoginButtonProps {
  onSuccess: (token: string) => void;
  onError?: (error: any) => void;
  clientId: string;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
}

// Declarar tipos globales para Google
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  clientId,
  text = "signin_with",
  theme = "outline",
  size = "large",
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cargar el script de Google Identity Services
    const loadGoogleScript = () => {
      if (document.getElementById("google-identity-script")) {
        initializeGoogle();
        return;
      }

      const script = document.createElement("script");
      script.id = "google-identity-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    };

    const initializeGoogle = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme,
          size,
          text,
          width: "100%",
          shape: "rectangular",
        });
      }
    };

    const handleCredentialResponse = (response: any) => {
      if (response.credential) {
        onSuccess(response.credential);
      } else {
        onError?.(new Error("No se recibió credential de Google"));
      }
    };

    loadGoogleScript();
  }, [clientId, onSuccess, onError, text, theme, size]);

  return (
    <div className='w-full'>
      <div ref={buttonRef} className='w-full flex justify-center'></div>
    </div>
  );
};
