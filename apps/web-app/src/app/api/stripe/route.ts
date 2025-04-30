import { NextRequest , NextResponse } from 'next/server';
import Stripe from "stripe";

// creer une instance de stripe avec la clé secrete 
const stripe =new Stripe(process.env.STRIPE_SECRET_KEY!,{// ! => pour dire que cette variable ne sera jamais nulle ou indéfinie 
    // pour eviter que le code ne se casse pas à cause des modifications futures dans l'API on doit spécifier la version
    apiVersion:"2025-03-31.basil",
});

export  async function POST(req:NextRequest) {
    try{
        const session=await stripe.checkout.sessions.create({
            mode:"payment",
            ui_mode:"embedded",
            return_url:"http://localhost:4200",
            line_items:[
                {// ce que le client va acheter 
                price_data:{
                    currency:"eur",
                    product_data:{
                        name:" abbonement ",
                    },
                    unit_amount:1500,// en cent
                },
                quantity:1,
            }
            ]
        });
        return NextResponse.json({clientSecret:session.client_secret})

    }catch (error){
        console.error("Erreur Stripe Api :",error);
        return NextResponse.json(
            {error:"Erreur lors de la création de la session"},
            {status:500}
        );
    }

}
