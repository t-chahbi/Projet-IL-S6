'use client';

import { useState, useCallback } from 'react';

export interface ToastData {
  /** Identifiant unique */
  id: string;
  /** Titre principal (facultatif) */
  title?: string;
  /** Texte descriptif (facultatif) */
  description?: string;
  /** Élément React pour une action (bouton, lien…) (facultatif) */
  action?: React.ReactNode;
  /** État d’ouverture, passé à <Toast open={open} /> */
  open: boolean;
  /** Callback passé à <Toast onOpenChange={…} />, supprime la toast quand on le ferme */
  onOpenChange: (open: boolean) => void;
}

/**
 * Hook pour piloter vos toasts.
 * 
 * Usage :
 *   const { toasts, showToast } = useToast();
 *   showToast({ title, description, action, duration });
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    (options: {
      title?: string;
      description?: string;
      action?: React.ReactNode;
      /** Durée avant fermeture automatique en ms (défaut : 3000) */
      duration?: number;
    }) => {
      const { title, description, action, duration = 3000 } = options;
      const id = crypto.randomUUID();

      const onOpenChange = (open: boolean) => {
        if (!open) {
          setToasts((current) => current.filter((t) => t.id !== id));
        }
      };

      const newToast: ToastData = {
        id,
        title,
        description,
        action,
        open: true,
        onOpenChange,
      };

      setToasts((current) => [...current, newToast]);

      // Fermeture automatique
      setTimeout(() => {
        onOpenChange(false);
      }, duration);

      return id;
    },
    []
  );

  return { toasts, showToast };
}