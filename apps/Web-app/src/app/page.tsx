"use client";
import React from 'react';
import { Header } from "@/components/ui/home/Header";
import { About } from "@/components/ui/home/About";
import { Footer } from "@/components/ui/home/Footer";
import SearchPage  from "@/components/ui/home/SearchBar"; 
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

    <div  className="flex flex-col min-h-screen bg-gradient-to-l from-[#1B00CD] to-[#100028] ">
      <div className=" w-full  p-6 shadow-md bg-opacity-20 ">
        <Header/>
      </div>

      <div className="flex justify-center">
        <div className=" bg-white p-4 rounded-lg shadow-lg w-4/6">
          <SearchPage></SearchPage>
        </div>
      </div>

      <div className="flex justify-center my-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Rejoindre une room
        </button>
      </div>

      <div className="items-center flex justify-center ">
        <div className=" w-full p-3 bg-gray-600 bg-opacity-30 rounded-lg shadow-lg mt-14">
          <About />
        </div>
      </div>


      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4 text-black">Rejoindre une room</h2>
            <input
              type="text"
              placeholder="Room ID"
              className="w-full mb-2 p-2 border rounded"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe (optionnel)"
              className="w-full mb-4 p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleJoinRoom}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
