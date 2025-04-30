"use client";

import { useEffect, useState } from "react";

const Comment=({text}:{text:string})=>{
    return(
        <p>{text}</p>
    );

};


export default function Comments(){

    const commentsList=[
        "Je voulais juste dire que Watch2Gether est absolument merveilleux et que ma copine et moi l'utilisons beaucoup depuis que nous sommes dans une relation à distance.",
        "Cette page pourrait être d'un grand intérêt pour les enseignants. Il permet aux étudiants de regarder des vidéos ensemble et de les commenter.",
        "Mes amis et moi aimons Watch2Gether. Nous ne vivons plus l'un à côté de l'autre, nous pouvons donc continuer notre tradition de regarder des vidéos ensemble. Nous utilisons Watch2Gether depuis le début et nous continuerons à le faire."
    ]
    // creation de l'index et du setteur de l'index et initialisation de l'index à 0 
    const [currentIndex , setCurrentIndex]=useState(0);
    useEffect(()=>{
        // code qui s'execute apres l'affichage du composant et qui reinitialise la cache sur ces valeurs d'indexes
        // setInterval() => une fonction qui repete du code toutes les X millisecondes 
        // setCurrentIndex => change la valeure du current index 
        const interval=setInterval(()=> {
            setCurrentIndex((Index) => (Index+1) % 3 )
        },5000)
        return () => {
            clearInterval(interval);
        }
    }
    )
    return(
        <div className="text-center flex flex-col justify-center text-black">
            <Comment text={commentsList[currentIndex]}></Comment>
        </div>
    );
};
export{Comments}