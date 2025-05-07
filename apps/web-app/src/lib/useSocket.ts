import io from 'socket.io-client';
import { useEffect, useRef } from 'react';

const socket = io('http://localhost:3001');

export const useSocket = () => {
  const socketRef = useRef(socket);

  useEffect(() => {
    socketRef.current = socket;

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return socketRef.current;
};
export const useSocketEvent = (event: string, callback: (...args: any[]) => void) => {
  const socket = useSocket();

  useEffect(() => {
    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [event, callback, socket]);
}
export const useSocketEmit = (event: string) => {
  const socket = useSocket();

  const emit = (...args: any[]) => {
    socket.emit(event, ...args);
  };

  return emit;
}
export const useSocketOn = (event: string, callback: (...args: any[]) => void) => {
  const socket = useSocket();

  useEffect(() => {
    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [event, callback, socket]);
}