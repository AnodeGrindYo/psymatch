import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const VideoCall = () => {
  const { sessionId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.current = io('http://localhost:3000');

    socket.current.emit('join', sessionId);

    socket.current.on('offer', async (offer) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.current.emit('answer', { answer, sessionId });
    });

    socket.current.on('answer', async (answer) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.current.on('ice-candidate', async (candidate) => {
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding received ice candidate', error);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [sessionId]);

  useEffect(() => {
    const startCall = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection();

      stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

      peerConnection.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit('ice-candidate', { candidate: event.candidate, sessionId });
        }
      };

      if (!isConnected) {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.current.emit('offer', { offer, sessionId });
        setIsConnected(true);
      }
    };

    startCall();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, [isConnected, sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibold text-blue-500 mb-6">Appel Vidéo</h2>
      <div className="flex">
        <video ref={localVideoRef} autoPlay className="w-1/2 h-auto border" />
        <video ref={remoteVideoRef} autoPlay className="w-1/2 h-auto border" />
      </div>
    </div>
  );
};

export default VideoCall;
