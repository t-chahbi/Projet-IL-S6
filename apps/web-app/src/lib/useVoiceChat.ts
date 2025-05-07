import { useEffect, useRef, useState } from "react";
import { useSocketEvent, useSocketEmit } from "./useSocket";

export const useVoiceChat = (roomId: string, userName: string, clientId: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const peersRef = useRef<Record<string, RTCPeerConnection>>({});

  const emitSignal = useSocketEmit("webrtc-signal");

  // ───── Helper : créer ou récupérer un RTCPeerConnection ─────
  const getPeer = (peerId: string) => {
    if (peersRef.current[peerId]) return peersRef.current[peerId];

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peersRef.current[peerId] = pc;

    pc.onicecandidate = ({ candidate }) =>
      candidate && emitSignal({ roomId, from: clientId, to: peerId, type: "ice", candidate });

    pc.ontrack = ({ streams: [stream] }) => {
      const audio = new Audio();
      audio.srcObject = stream;
      audio.autoplay = true;
    };

    // Si nous avons déjà notre stream local, on l’ ajoute immédiatement.
    if (localStream) localStream.getTracks().forEach((t) => pc.addTrack(t, localStream!));

    return pc;
  };

  // ───── Obtenir le micro et prévenir la room ─────
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((s) => {
      setLocalStream(s);
      // Chaque nouvelle piste est envoyée à tous les peers actifs
      Object.values(peersRef.current).forEach((pc) => s.getTracks().forEach((t) => pc.addTrack(t, s)));
    });
  }, []);

  // ───── Réception des signaux (offer/answer/ice) ─────
  useSocketEvent("webrtc-signal", async (msg) => {
    if (msg.roomId !== roomId || msg.to !== clientId) return;
    const pc = getPeer(msg.from);

    if (msg.type === "offer") {
      await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      emitSignal({ roomId, from: clientId, to: msg.from, type: "answer", sdp: answer });
    } else if (msg.type === "answer") {
      await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    } else if (msg.type === "ice" && msg.candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
    }
  });

  // ───── Gestion d’un nouveau peer dans la room (diffusé par le serveur) ─────
  useSocketEvent("peer-join", async (peerId: string) => {
    if (peerId === clientId) return;
    const pc = getPeer(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    emitSignal({ roomId, from: clientId, to: peerId, type: "offer", sdp: offer });
  });

  return { stream: localStream };
};