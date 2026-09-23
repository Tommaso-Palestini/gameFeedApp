import { useEffect, useState } from 'react';

export function useDebounce<T>(valore: T, ritardo = 300): T {
  const [valoreDebounced, setValoreDebounced] = useState(valore);

  useEffect(() => {
    const timer = setTimeout(() => setValoreDebounced(valore), ritardo);
    return () => clearTimeout(timer);
  }, [valore, ritardo]);

  return valoreDebounced;
}