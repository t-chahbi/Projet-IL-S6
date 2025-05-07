import React from 'react';
import { ButtonsCard } from "@/components/ui/tailwindcss-buttons"; // Chemin d'accès à `tailwindcss-buttons.tsx`

const App = () => {
  const handleClick = () => {
    console.log("Card clicked!");
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-4">Bienvenue sur l'application</h1>
      <ButtonsCard >
        <p>Cliquer ici pour déclencher l'action</p>
      </ButtonsCard>
    </div>
  );
};

export default App;
