import io from 'socket.io-client';
import { useEffect, useRef ,useState} from 'react';

const socket = io('http://localhost:3001');
export const useVoiceChat = (roomId,userId , peerId)=> {
  const [stream,setStream]=useState(null);
  const peerRef=useRef(null);
  const emitOffer= useSocketEmit('webrtc-offer');
  const emitAnswer=useSocketEmit('webrtc-answer');
  const emitCandidate=useSocketEmit('webrtc-candidate');

  useEffect(()=>{
    const pc = new RTCPeerConnection();
    peerRef.current=pc;
    pc.onicecandidate=(event)=>{
      if(event.candidate){
        emitCandidate({roomId , candidate:event.candidate , to:peerId});
      }
    };

    pc.ontrack=(event)=>{
      const remoteAudio=new Audio();
      remoteAudio.srcObject=event.streams[0];
      remoteAudio.autoplay=true;
    };

    pc.ontrack=(event)=>{
      const remoteAudio= new Audio();
      remoteAudio.srcObject=event.streams[0]
      remoteAudio.autoplay=true;
    };

    navigator.mediaDevices.getUserMedia({audio:true}).then(localStream => {
      setStream(localStream);
      localStream.getTracks().forEach(track => {
        pc.addTrack(track,localStream);
      });
      if (userId <peerId){
        pc.createOffer().then(offer => {
          pc.setLocalDescription(offer);
          emitOffer({roomId,offer , to:peerId});
        });
      }
    });
  }, [roomId,userId,peerId]);

  useSocketOn ('webrtc-offer',async({from , offer}) => {
    if(from !==peerId) return ;
    const pc=peerRef.current;
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer =await pc.createAnswer();
    await pc.setLocalDescription(answer);
    emitAnswer({roomId , answer , to:from});
  });


  useSocketOn('webrtc-answer',async({from , answer}) => {
    if(from !==peerId) return ;
    const pc =peerRef.current;
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  });

  useSocketOn('webrtc-candidate',async({from, candidate})=>{
    if(from!==peerId) return ; 
    const pc = peerRef.current ;
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  });
  return {stream};
};

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

