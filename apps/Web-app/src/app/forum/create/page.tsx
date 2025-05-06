"use client";

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const supabaseUrl = 'https://hjvnggilhhnqcejlcipw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!; // Ajout de l'assertion de non-nullité pour garantir que la clé est définie
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    // Récupérer l'utilisateur connecté
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Erreur lors de la récupération de l’utilisateur :', userError);
      alert('Vous devez être connecté pour créer un post.');
      return;
    }

    // Insérer le post avec l'author_id
    const { error } = await supabase.from('forum_posts').insert([
      { title, content, author_id: user.id },
    ]);

    if (error) {
      console.error('Erreur lors de la création du post :', error);
    } else {
      router.push('/forum'); // Redirige vers la page principale des posts
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Créer un nouveau post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-400">
            Titre
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-400">
            Contenu
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600">
          Créer
        </Button>
      </form>
    </div>
  );
}