import React from 'react';
import { Header } from "@/components/ui/home/Header"; // Chemin d'accès à `tailwindcss-buttons.tsx`
import { About } from "@/components/ui/home/About";
import { Footer } from "@/components/ui/home/Footer";
import SearchPage  from "@/components/ui/home/SearchBar"; 
import Footer from '@/components/ui/home/Footer';

const App = () => {
  const handleClick = () => {
    console.log("Card clicked!");
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

      <div className="items-center flex justify-center ">
        <div className=" w-full p-3 bg-gray-600 bg-opacity-30 rounded-lg shadow-lg mt-14">
          <About />
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default App;
