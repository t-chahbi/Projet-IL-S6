'use client';

import React from 'react';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button'; // Exemple d'un bouton personnalisé

type FormData = {
  email: string;
  password: string;
};

export default function AuthPage() {
  const form = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form data:', data);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="w-full max-w-lg">
        <div
          style={{
            boxShadow:
              '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
          className="overflow-hidden bg-gray-800 rounded-lg shadow-xl"
        >
          <div className="p-8">
            <h2 className="text-3xl font-extrabold text-center text-white">
              Connexion à votre compte
            </h2>
            <p className="mt-4 text-center text-gray-400">
              Entrez votre adresse e-mail et votre mot de passe pour vous
              connecter.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-8 space-y-6"
              >
                {/* Champ Email */}
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          type="email"
                          placeholder="adresse e-mail"
                          className="relative block w-full px-3 py-3 text-white bg-gray-700 border border-gray-700 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Champ Mot de passe */}
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          type="password"
                          placeholder="mot de passe"
                          className="relative block w-full px-3 py-3 text-white bg-gray-700 border border-gray-700 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Checkbox et lien */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <input
                      className="w-4 h-4 text-indigo-500 border-gray-600 rounded focus:ring-indigo-400"
                      type="checkbox"
                      name="remember-me"
                      id="remember-me"
                    />
                    <label
                      className="block ml-2 text-sm text-gray-400"
                      htmlFor="remember-me"
                    >
                      se souvenir de moi
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      className="font-medium text-indigo-500 hover:text-indigo-400"
                      href="#"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                </div>

                {/* Bouton de soumission */}
                <div>
                  <Button
                    type="submit"
                    className="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-gray-900 bg-indigo-500 border border-transparent rounded-md group hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Se connecter
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <div className="px-8 py-4 text-center bg-gray-700">
            <span className="text-gray-400">Pas de compte? </span>
            <a
              className="font-medium text-indigo-500 hover:text-indigo-400"
              href="#"
            >
              Créer un compte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
