import { useState, useEffect } from "react";

/**
 * Hook personalizado para "retrasar" la ejecución de un efecto
 * después de que el usuario deja de escribir.
 * @param value El valor que se quiere "retrasar" (ej. el texto de búsqueda)
 * @param delay El tiempo de espera en milisegundos (ej. 500)
 */
export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Configura un temporizador para actualizar el valor "retrasado"
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpia el temporizador si el valor cambia (antes de que se cumpla el delay)
    // Esto evita que se actualice con cada letra tecleada
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
