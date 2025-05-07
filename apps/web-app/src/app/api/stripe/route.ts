import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// créer une instance de Stripe avec la clé secrète 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // utiliser la version d’API compatible avec @stripe/stripe-node installé
  apiVersion: '2025-04-30.basil',
});

export async function POST(req: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ui_mode: 'embedded',
      return_url: 'http://localhost:4200',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'abonnement',
            },
            unit_amount: 1500, // en centimes
          },
          quantity: 1,
        },
      ],
    });
    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Erreur Stripe API :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    );
  }
}