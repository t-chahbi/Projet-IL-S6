'use client';

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const MessageTest = () => {
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on('receive-message', ({ userId, message }) => {
      setMessages((prev) => [...prev, { userId, message }]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, []);

  const createRoom = () => {
    if (roomId.trim() !== '') {
      socket.emit('test-create-room', { roomId }, (response) => {
        if (response.success) {
          setJoined(true);
          setMessages((prev) => [...prev, 'Salle de test créée et rejointe !']);
        } else {
          alert('Échec de la création de la salle de test.');
        }
      });
    }
  };

  const joinRoom = () => {
    if (roomId.trim() !== '') {
      socket.emit('test-join-room', { roomId }, (response) => {
        if (response.success) {
          setJoined(true);
          setMessages((prev) => [
            ...prev,
            'Vous avez rejoint la salle de test !',
          ]);
        } else {
          alert('Échec de la connexion à la salle de test.');
        }
      });
    }
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('send-message', { roomId, message });
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen p-4 bg-white">
      {!joined ? (
        <div className="max-w-md mx-auto">
          <h1 className="mb-4 text-2xl font-bold text-center">
            Rejoindre ou créer une salle
          </h1>
          <input
            type="text"
            placeholder="ID de la salle"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          />
          <div className="flex justify-between">
            <button
              onClick={joinRoom}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Rejoindre la salle
            </button>
            <button
              onClick={createRoom}
              className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Créer une salle
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold text-center">
            Salle : {roomId}
          </h1>
          <div className="h-64 p-4 mb-4 overflow-y-scroll bg-gray-100 border rounded-md">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">{msg.userId} :</span> {msg.message}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Écrire un message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 border rounded-md"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageTest;
