"use client";
import React from 'react';
import { Button } from "@/components/ui/home/Button";
import { Header } from "@/components/ui/home/Header";
import { About } from "@/components/ui/home/About";
import { Footer } from "@/components/ui/home/Footer";
import SearchPage from "@/components/ui/home/SearchBar";
import { useSocket } from "@/lib/useSocket";
import { useRouter } from "next/navigation";
import { useState } from "react";

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const socket = useSocket();
  const router = useRouter();

  const emitJoinRoom = React.useCallback(
    (data, callback) => socket.emit("join-room", data, callback),
    [socket]
  );

  const handleJoinRoom = () => {
    emitJoinRoom({ roomId, password }, (response: { success: boolean }) => {
      if (response.success) {
        router.push(`/${roomId}`);
      } else {
        alert("Room not found or incorrect password");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0e1525] text-gray-200">
      <div className="w-full p-6 shadow-md bg-[#111827] border-b border-teal-500">
        <Header />
      </div>

      <div className="flex justify-center mt-8">
        <div className="bg-gray-600/40 border border-teal-500 p-4 rounded-lg shadow w-4/6 backdrop-blur-sm">
          <SearchPage />
        </div>
      </div>


      <div className="flex justify-center my-6">
        <Button onClick={() => setShowModal(true)}>
          Rejoindre une room
        </Button>
      </div>

      <div className="items-center flex justify-center">
        <div className="w-full p-3 bg-[#111827] border border-teal-500 rounded-lg shadow mt-14">
          <About />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 border border-teal-800 p-6 rounded-lg shadow-md w-96 text-white">
            <h2 className="text-2xl font-semibold mb-4">Rejoindre une room</h2>

            <input
            type="text"
            placeholder="Room ID"
            className="w-full mb-2 p-2 bg-gray-900 text-white border border-teal-800 rounded placeholder-gray-400"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            />
            <input
            type="password"
            placeholder="Mot de passe (optionnel)"
            className="w-full mb-4 p-2 bg-gray-900 text-white border border-teal-800 rounded placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer transition-all bg-gray-700 text-white px-6 py-2 rounded-lg
                border-teal-800 border-b-[4px]
                hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                >
                Annuler
              </button>
              <button
                onClick={handleJoinRoom}
                className="cursor-pointer transition-all bg-teal-700 text-white px-6 py-2 rounded-lg
                border-teal-800 border-b-[4px]
                hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
              >
                Rejoindre
            </button>
      </div>
    </div>
  </div>
)}


      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default App;
