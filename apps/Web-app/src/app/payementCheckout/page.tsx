"use client";
import {useEffect , useState} from "react"; // useState : pour stocker la clé clientSecret retourné par l'API  / useEffect : pour declencher la requete de chargement de la page 
import {EmbeddedCheckoutProvider , EmbeddedCheckout} from "@stripe/react-stripe-js"; // les bibs qui rendent le formulaire de paiement 
import {loadStripe} from "@stripe/stripe-js";

const stripePromise=loadStripe(" ");// initialiser stripe avec la clé publique 


