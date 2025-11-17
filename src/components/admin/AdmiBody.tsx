// src/components/admin/AdmiBody.tsx
import React from "react";

const AdmiBody = ({ children }: { children?: React.ReactNode }) => (
  // 💡 1. Fondo blanco y con scroll automático
  // 💡 2. Sin padding (el padding lo pone la página, como 'InicioAdm.tsx')
  <main className='flex-1 bg-white overflow-y-auto'>{children}</main>
);

export default AdmiBody;
