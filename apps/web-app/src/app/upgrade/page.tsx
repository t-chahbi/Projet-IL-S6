import { UpgradeCard } from "@/components/ui/home/UpgradeCard";


const App = () => {
  
    return (
      <div  className="flex flex-row min-h-screen bg-gradient-to-l from-[#1B00CD] to-[#100028] justify-center w-screen p-20">
        <div className="w-4/6 flex flex-row justify-between">
        <UpgradeCard title="Watch2Gether PLUS" price=" 3.90" description="Pour les utilisateurs qui souhaitent améliorer leur expérience personnelle Watch2Gether." properties="Pas de bannières publicitaires* dans chaque pièce que vous visitez

            Couleur de chat personnelle

            Plus de réactions de confettis

            Chats animés

            GIF animés dans les messages de chat"/> 
        <UpgradeCard title="Watch2Gether PRO" price=" 8.90" description="Pour les modérateurs qui souhaitent améliorer l'expérience dans leurs salles Watch2Gether." properties="Tout de Watch2Gether PLUS

            Pas de bannières publicitaires* dans chaque pièce que vous créez. (Pour tous les utilisateurs visitant ce salon)

            Désactiver les recommandations vidéo Watch2Gether

            Désactiver les liens vidéo dans le chat

            Restreindre l'accès à la salle aux utilisateurs enregistrés"/>          
         
        </div>
          
      </div>  
    );
  };
  
  export default App;