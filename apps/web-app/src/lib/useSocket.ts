// ========================== lib/useSocket.ts ===========================
import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { v4 as uuid } from "uuid";

declare global {
  // eslint-disable-next-line no-var
  var __WS_SOCKET__: Socket | undefined;
  // eslint-disable-next-line no-var
  var __WS_SOCKET_PROMISE__: Promise<Socket> | undefined;
}

const WS_URL = "http://localhost:3001";
const getClientKey = (): string => {
  if (typeof window === "undefined") return uuid();
  const stored = localStorage.getItem("clientKey");
  if (stored) return stored;
  const key = uuid();
  localStorage.setItem("clientKey", key);
  return key;
};

/**
 * Crée la socket en attendant l’événement "connect" avant de résoudre
 */
const createBrowserSocket = async (): Promise<Socket> => {
  const { io } = await import("socket.io-client");
  return new Promise((resolve, reject) => {
    const socket = io(WS_URL, {
      transports: ["websocket"],
      autoConnect: true,
      auth: { clientKey: getClientKey() },
    });
    socket.once("connect", () => resolve(socket));
    socket.once("connect_error", (err) => reject(err));
  });
};

/**
 * Retourne la même promesse de création de socket, pour éviter les courses multiples
 */
const getGlobalSocket = (): Promise<Socket> => {
  if (globalThis.__WS_SOCKET__) {
    return Promise.resolve(globalThis.__WS_SOCKET__);
  }
  if (globalThis.__WS_SOCKET_PROMISE__) {
    return globalThis.__WS_SOCKET_PROMISE__;
  }
  if (typeof window === "undefined") {
    return Promise.reject(new Error("useSocket appelé côté serveur"));
  }
  globalThis.__WS_SOCKET_PROMISE__ = createBrowserSocket().then((sock) => {
    globalThis.__WS_SOCKET__ = sock;
    return sock;
  });
  return globalThis.__WS_SOCKET_PROMISE__;
};

/**
 * Hook React : ne met à jour l’état que lorsque la socket est connectée
 */
export const useSocket = (): Socket | undefined => {
  const [sock, setSock] = useState<Socket>();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      getGlobalSocket()
        .then((socket) => setSock(socket))
        .catch((err) => console.error("Erreur de socket :", err));
    }
  }, []);

  return sock;
};

// Helpers inchangés
export const useSocketEvent = (event: string, cb: (...a: any[]) => void) => {
  const socket = useSocket();
  const saved = useRef(cb);
  saved.current = cb;

  useEffect(() => {
    if (!socket) return;
    const handler = (...args: any[]) => saved.current(...args);
    socket.on(event, handler);
    return () => void socket.off(event, handler);
  }, [event, socket]);
};

export const useSocketEmit = (event: string) => {
  const socket = useSocket();
  return (...args: any[]) => void socket?.emit(event, ...args);
};