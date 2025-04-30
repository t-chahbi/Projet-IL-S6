"use client";
import {useEffect , useState} from "react"; // useState : pour stocker la clé clientSecret retourné par l'API  / useEffect : pour declencher la requete de chargement de la page 
import {EmbeddedCheckoutProvider , EmbeddedCheckout} from "@stripe/react-stripe-js"; // les bibs qui rendent le formulaire de paiement 
import {loadStripe} from "@stripe/stripe-js";

const stripePromise=loadStripe("pk_test_51RH3MB2elpAwMXPQ5CaX3dSSqTjR6FRmPqKM0kBpQFQa7DICbZELBEROHolAgFFtYd1lXdcEJipWlGrfD5Pj8Nqn00i9zIRQdI");// initialiser stripe avec la clé publique 
const PayementCheckout =()=>{
    //stocker la session du payement 
    // la bib Stripe attend exactement un nom clientSecret
    const [clientSecret , setClientSecret]=useState(""); //clientSession : pour identifier la session de paiement
    //appel de l'api pour creer une session de stripe 
    
    useEffect(()=>{
        // envoyer une requete POST pour creer une session de paiement avec Stripe qui renvoie clientSession  
        fetch("/api/stripe",{
            method:"POST",
        })
        .then((res)=>res.json())// la reponse de fetch 
        .then((data)=>setClientSecret(data.clientSecret));//data cest res.json

    },[]);
    return (
        <div className="bg-gray-100 rounded-xl  w-5/12 flex-col p-6 ">
        <div className="flex flex-col justify-around ">
            <h2 className="text-5xl mb-6">Finalisez votre paiement </h2>

        </div>
       {clientSecret && stripePromise && (
        //si session de paiement est prete et que Stripe est chargé je montre le formulaire avec 
        <EmbeddedCheckoutProvider stripe ={stripePromise} options={{clientSecret}}>
            <EmbeddedCheckout/>
        </EmbeddedCheckoutProvider>
       )
       }
       {
        !clientSecret && <p>Chargement du paiement ....</p>
       }
    </div>
    )
};

export{PayementCheckout};