// src/hooks/use-mobile.ts
import { useState, useEffect } from 'react';

/**
 * Renvoie `true` si la largeur de la fenêtre est ≤ 768px.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    // initial
    setIsMobile(mql.matches);
    // listener
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => {
      mql.removeEventListener('change', onChange);
    };
  }, []);

  return isMobile;
}