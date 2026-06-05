import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:5000';

export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);

    s.on('connect', () => {
      setConnected(true);
    });

    s.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  return { socket, connected };
}
