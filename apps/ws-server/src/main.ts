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
  videoUrl?: string;
  users: Record<string, string>; // socket.id -> username
}

const roomStates: Record<string, SyncState> = {};
const roomMeta: Record<string, RoomMeta> = {};

const broadcastRoomState = (roomId: string) => {
  const meta = roomMeta[roomId];
  const state = roomStates[roomId];
  if (!meta || !state) return;

  io.to(roomId).emit("room-state", {
    videoUrl: meta.videoUrl,
    users: Object.values(meta.users),
    currentTime: state.currentTime,
    isPlaying: state.isPlaying,
  });
};

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('create-room', ({ roomId, password, video }: { roomId: string; password?: string; video: { url: string } }, callback: (response: { success: boolean; roomId?: string }) => void) => {
    if (roomMeta[roomId]) {
      callback({ success: false });
      return;
    }

    roomMeta[roomId] = {
      hostId: socket.id,
      createdAt: Date.now(),
      password,
      videoUrl: video.url,
      users: {},
    };

    roomStates[roomId] = { currentTime: 0, isPlaying: false };

    socket.join(roomId);
    callback({ success: true, roomId });
    console.log(`Room ${roomId} created by ${socket.id}`);
  });

  socket.on('join-room', ({ roomId, password, name }: { roomId: string; password?: string; name?: string }, callback: (response: { success: boolean; videoUrl?: string; userId?: string }) => void) => {
    const meta = roomMeta[roomId];

    if (!meta) {
      callback({ success: false });
      return;
    }

    if (meta.password && meta.password !== password) {
      callback({ success: false });
      return;
    }

    socket.join(roomId);
    const displayName = name || socket.id;
    meta.users[socket.id] = displayName;

    console.log(`${socket.id} joined room ${roomId}`);

    const state = roomStates[roomId] || { currentTime: 0, isPlaying: false };
    socket.emit('sync', state);
    io.to(roomId).emit('users', Object.values(meta.users));
    callback({ success: true, videoUrl: meta.videoUrl, userId: socket.id });
    broadcastRoomState(roomId);
  });

  socket.on('sync', ({ roomId, currentTime, isPlaying }: { roomId: string; currentTime: number; isPlaying: boolean }) => {
    if (!roomStates[roomId]) return;
    roomStates[roomId] = { currentTime, isPlaying };
    broadcastRoomState(roomId);
  });

  socket.on("video-play", ({ roomId }) => {
    if (roomStates[roomId]) {
      roomStates[roomId].isPlaying = true;
      broadcastRoomState(roomId);
    }
  });

  socket.on("video-pause", ({ roomId }) => {
    if (roomStates[roomId]) {
      roomStates[roomId].isPlaying = false;
      broadcastRoomState(roomId);
    }
  });

  socket.on("seek", ({ roomId, currentTime }) => {
    if (roomStates[roomId]) {
      roomStates[roomId].currentTime = currentTime;
      broadcastRoomState(roomId);
    }
  });

  // Handler to update the current video URL for a room
  socket.on('set-video', ({ roomId, videoUrl }: { roomId: string; videoUrl: string }) => {
    console.log(`Video URL set for room ${roomId}: ${videoUrl}`);
    if (roomMeta[roomId]) {
      roomMeta[roomId].videoUrl = videoUrl;
      broadcastRoomState(roomId);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    for (const [roomId, meta] of Object.entries(roomMeta)) {
      if (meta.users[socket.id]) {
        delete meta.users[socket.id];
        io.to(roomId).emit('users', Object.values(meta.users));
        broadcastRoomState(roomId);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});