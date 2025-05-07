import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
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

interface WebRTCSigPayload {
  roomId: string;
  to?: string;           // socket.id destination
  type: "offer" | "answer" | "ice";
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  from?: string;         // ajouter côté serveur avant d'émettre
}

const roomStates: Record<string, SyncState> = {};
const roomMeta: Record<string, RoomMeta> = {};

const broadcastRoomState = (roomId: string) => {
  const meta = roomMeta[roomId];
  const state = roomStates[roomId];
  if (!meta || !state) return;

  io.to(roomId).emit('room-state', {
    videoUrl: meta.videoUrl,
    users: Object.values(meta.users),
    currentTime: state.currentTime,
    isPlaying: state.isPlaying,
  });
};

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on(
    'create-room',
    (
      {
        roomId,
        password,
        video,
      }: { roomId: string; password?: string; video: { url: string } },
      callback: (response: { success: boolean; roomId?: string }) => void
    ) => {
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
    }
  );

  socket.on(
    'join-room',
    (
      {
        roomId,
        password,
        name,
      }: { roomId: string; password?: string; name?: string },
      callback: (response: {
        success: boolean;
        videoUrl?: string;
        userId?: string;
      }) => void
    ) => {
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

      // Prévenir les autres participants qu'un nouveau pair est arrivé
      socket.to(roomId).emit("peer-join", socket.id);

      console.log(`${socket.id} joined room ${roomId}`);

      const state = roomStates[roomId] || { currentTime: 0, isPlaying: false };
      socket.emit('sync', state);
      io.to(roomId).emit('users', Object.values(meta.users));
      callback({ success: true, videoUrl: meta.videoUrl, userId: socket.id });
      broadcastRoomState(roomId);
    }
  );

  socket.on(
    'sync',
    ({
      roomId,
      currentTime,
      isPlaying,
    }: {
      roomId: string;
      currentTime: number;
      isPlaying: boolean;
    }) => {
      if (!roomStates[roomId]) return;
      roomStates[roomId] = { currentTime, isPlaying };
      broadcastRoomState(roomId);
    }
  );

  socket.on('video-play', ({ roomId }) => {
    if (roomStates[roomId]) {
      roomStates[roomId].isPlaying = true;
      broadcastRoomState(roomId);
    }
  });

  socket.on('video-pause', ({ roomId }) => {
    if (roomStates[roomId]) {
      roomStates[roomId].isPlaying = false;
      broadcastRoomState(roomId);
    }
  });

  socket.on('seek', ({ roomId, currentTime }) => {
    if (roomStates[roomId]) {
      roomStates[roomId].currentTime = currentTime;
      broadcastRoomState(roomId);
    }
  });

  // Handler to update the current video URL for a room
  socket.on(
    'set-video',
    ({ roomId, videoUrl }: { roomId: string; videoUrl: string }) => {
      console.log(`Video URL set for room ${roomId}: ${videoUrl}`);
      if (roomMeta[roomId]) {
        roomMeta[roomId].videoUrl = videoUrl;
        broadcastRoomState(roomId);
      }
    }
  );

  // Compatibilité anciens / nouveaux noms d'événements
  const handleMessage = ({ roomId, message }: { roomId: string; message: string }) => {
    if (roomMeta[roomId]) {
      io.to(roomId).emit("message", {
        id: Date.now(),
        userId: socket.id,
        content: message,
        time: new Date().toISOString(),
      });
      console.log(`Message from ${socket.id} in room ${roomId}: ${message}`);
    }
  };
  socket.on("send-message", handleMessage);
  socket.on("message", handleMessage);

  // Relais de la signalisation WebRTC
  socket.on("webrtc-signal", (payload: WebRTCSigPayload) => {
    const { roomId, to, ...rest } = payload;
    // S'assure que l'émetteur appartient bien à la room
    if (!roomMeta[roomId] || !roomMeta[roomId].users[socket.id]) return;

    const message = { ...rest, roomId, from: socket.id };
    if (to) {
      io.to(to).emit("webrtc-signal", message);
    } else {
      // broadcast à toute la room sauf l'émetteur
      socket.to(roomId).emit("webrtc-signal", message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    for (const [roomId, meta] of Object.entries(roomMeta)) {
      if (meta.users[socket.id]) {
        delete meta.users[socket.id];
        io.to(roomId).emit('users', Object.values(meta.users));
        socket.to(roomId).emit("peer-leave", socket.id);
        broadcastRoomState(roomId);
      }
    }
  });

  //room pour les tests
  socket.on(
    'test-create-room',
    (
      { roomId }: { roomId: string },
      callback: (response: { success: boolean }) => void
    ) => {
      if (roomMeta[roomId]) {
        callback({ success: false });
        return;
      }

      roomMeta[roomId] = {
        hostId: socket.id,
        createdAt: Date.now(),
        users: {},
      };

      roomStates[roomId] = { currentTime: 0, isPlaying: false };

      socket.join(roomId);
      callback({ success: true });
      console.log(`Test Room ${roomId} created by ${socket.id}`);
    }
  );

  //connexion à une room pour les tests
  socket.on(
    'test-join-room',
    (
      { roomId }: { roomId: string },
      callback: (response: { success: boolean }) => void
    ) => {
      const meta = roomMeta[roomId];

      if (!meta) {
        callback({ success: false });
        return;
      }

      socket.join(roomId);
      meta.users[socket.id] = socket.id;

      console.log(`${socket.id} joined test room ${roomId}`);

      callback({ success: true });
    }
  );
  socket.on('webrtc-offer',({roomId , offer}) =>{
    console.log("users :", roomMeta[roomId].users);
    console.log("type :", typeof(roomMeta[roomId].users));

    /* .forEach((userId : string) => {
      socket.to(userId).emit('webrtc-offer',{
        from : socket.id,
        offer 
      });
    }); */
  });

  socket.on('webrtc-answer',({roomId,answer,users})=> {
    users.forEach((userId : string) => {
      socket.to(userId).emit('webrtc-answer',{
        from : socket.id,
        answer
      });
    });
  });
  
  socket.on('webrtc-candidate',({roomId,candidate,users})=> {
    users.forEach((userId : string) => {
      socket.to(userId).emit('webrtc-candidate',{
        from : socket.id,
        candidate 
      });
    });
  });

});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
