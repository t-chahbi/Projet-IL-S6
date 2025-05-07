"use client";
import {Button} from "@/components/ui/home/Button"

type UpgradeCardArg={
    title: string;
  price: string;
  description: string;
  properties: string;
  //pay: string; // Si ce champ est optionnel
};
const UpgradeCard=({title , price , description , properties}:UpgradeCardArg)=>{
  return (
    <div className="bg-gray-600 rounded-xl flex justify-between w-5/12 flex-col p-6 ">
        <div className="flex flex-col justify-around h-1/3">
            <h2 className="text-5xl">{title}</h2>
            <div className="flex flex-row items-en">€<h1 className="text-3xl">{price}</h1>/mois</div>
        </div>
        <div className="border-[#1B00CD] w-full border-t-2 "></div>
        <div className="flex flex-col justify-around h-1/3">
            <strong>{description}</strong>
            <p>{properties}</p>
        </div>
        <div className="mt-9">
            <Button>S'abonner </Button>
        </div>
    </div>
  );
};
export{UpgradeCard};