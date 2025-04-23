import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

interface SyncState {
  currentTime: number;
  isPlaying: boolean;
}

interface RoomMeta {
  hostId: string;
  createdAt: number;
  password?: string;
}

const roomStates: Record<string, SyncState> = {};
const roomMeta: Record<string, RoomMeta> = {};

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('createRoom', ({ roomId, password }: { roomId: string; password?: string }) => {
    if (roomMeta[roomId]) {
      socket.emit('error', { message: 'Room already exists' });
      return;
    }

    roomMeta[roomId] = {
      hostId: socket.id,
      createdAt: Date.now(),
      password
    };

    roomStates[roomId] = { currentTime: 0, isPlaying: false };

    socket.join(roomId);
    socket.emit('roomCreated', { roomId });
    console.log(`Room ${roomId} created by ${socket.id}`);
  });

  socket.on('joinRoom', ({ roomId, password }: { roomId: string; password?: string }) => {
    const meta = roomMeta[roomId];

    if (!meta) {
      socket.emit('error', { message: 'Room does not exist' });
      return;
    }

    if (meta.password && meta.password !== password) {
      socket.emit('error', { message: 'Incorrect password' });
      return;
    }

    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);

    const state = roomStates[roomId] || { currentTime: 0, isPlaying: false };
    socket.emit('sync', state);
  });

  socket.on('sync', ({ roomId, currentTime, isPlaying }: { roomId: string; currentTime: number; isPlaying: boolean }) => {
    if (!roomStates[roomId]) return;
    roomStates[roomId] = { currentTime, isPlaying };
    socket.to(roomId).emit('sync', { currentTime, isPlaying });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});