import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  toggleAudio: () => void;
  toggleVideo: () => void;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  sendMessage: (msg: string) => void;
  chatMessages: ChatMessage[];
  endCall: () => void;
  remoteUserId: string | null;
}

export interface ChatMessage {
  message: string;
  from: string;
  timestamp: Date;
}

export const useWebRTC = (appointmentId: string, currentUserId: string): UseWebRTCReturn => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [remoteUserId, setRemoteUserId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteUserIdRef = useRef<string | null>(null);

  const initSocket = useCallback(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      query: { userId: currentUserId },
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current?.id);
      socketRef.current?.emit('join-consultation', { appointmentId, userId: currentUserId });
    });

    socketRef.current.on('user-joined', async ({ userId }) => {
      console.log('User joined room:', userId);
      // If we are already in the room, we initiate the call to the new user
      remoteUserIdRef.current = userId;
      setRemoteUserId(userId); // ✅ expose to prescription builder
      await createOffer(userId);
    });

    socketRef.current.on('webrtc-offer', async ({ offer, from }) => {
      console.log('Received WebRTC Offer from:', from);
      remoteUserIdRef.current = from;
      setRemoteUserId(from); // ✅ expose to prescription builder
      await handleReceiveOffer(offer, from);
    });

    socketRef.current.on('webrtc-answer', async ({ answer }) => {
      console.log('Received WebRTC Answer');
      await handleReceiveAnswer(answer);
    });

    socketRef.current.on('webrtc-ice-candidate', async ({ candidate }) => {
      console.log('Received ICE Candidate');
      await handleReceiveCandidate(candidate);
    });

    socketRef.current.on('chat-message', (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
    });
  }, [appointmentId, currentUserId]);

  const initPeerConnection = () => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    
    // Send local ICE candidates to the remote peer
    pc.onicecandidate = (event) => {
      if (event.candidate && remoteUserIdRef.current) {
        socketRef.current?.emit('webrtc-ice-candidate', {
          to: remoteUserIdRef.current,
          candidate: event.candidate,
          from: currentUserId,
        });
      }
    };

    // Receive remote stream
    pc.ontrack = (event) => {
      console.log('Received remote track');
      setRemoteStream(event.streams[0]);
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const getMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);

      const pc = initPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };

  const createOffer = async (targetUserId: string) => {
    const pc = initPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    socketRef.current?.emit('webrtc-offer', {
      to: targetUserId,
      offer,
      from: currentUserId,
    });
  };

  const handleReceiveOffer = async (offer: RTCSessionDescriptionInit, fromUserId: string) => {
    const pc = initPeerConnection();
    
    // Add local stream tracks to the connection before answering
    if (localStream) {
      localStream.getTracks().forEach(track => {
        // Prevent adding the same track multiple times
        const senders = pc.getSenders();
        if (!senders.find(s => s.track?.id === track.id)) {
          pc.addTrack(track, localStream);
        }
      });
    }

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socketRef.current?.emit('webrtc-answer', {
      to: fromUserId,
      answer,
      from: currentUserId,
    });
  };

  const handleReceiveAnswer = async (answer: RTCSessionDescriptionInit) => {
    const pc = peerConnectionRef.current;
    if (pc && pc.signalingState !== 'stable') {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleReceiveCandidate = async (candidate: RTCIceCandidateInit) => {
    const pc = peerConnectionRef.current;
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  useEffect(() => {
    getMedia().then(() => {
      initSocket();
    });

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      socketRef.current?.disconnect();
      peerConnectionRef.current?.close();
    };
  }, [initSocket]); // Intentionally omitting localStream to prevent endless re-renders.

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const sendMessage = (message: string) => {
    socketRef.current?.emit('chat-message', {
      appointmentId,
      message,
      from: currentUserId,
    });
  };

  const endCall = () => {
    localStream?.getTracks().forEach((track) => track.stop());
    socketRef.current?.disconnect();
    peerConnectionRef.current?.close();
    setLocalStream(null);
    setRemoteStream(null);
  };

  return {
    localStream,
    remoteStream,
    toggleAudio,
    toggleVideo,
    isAudioEnabled,
    isVideoEnabled,
    sendMessage,
    chatMessages,
    endCall,
    remoteUserId,
  };
};
