"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PostDetailsPage({ params }) {
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const router = useRouter();
  const paramsData = React.use(params);
  const { id } = paramsData;

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase.from('forum_posts').select('*').eq('id', id).single();
      if (error) {
        console.error('Erreur lors de la récupération du post :', error);
      } else {
        setPost(data);
      }
    };

    const fetchReplies = async () => {
      const { data, error } = await supabase.from('forum_replies').select('*').eq('post_id', id);
      if (error) {
        console.error('Erreur lors de la récupération des réponses :', error);
      } else {
        setReplies(data);
      }
    };

    fetchPost();
    fetchReplies();
  }, [id]);

  const handleAddReply = async () => {
    if (!newReply) return;

    // Récupérer l'utilisateur connecté
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Erreur lors de la récupération de l’utilisateur :', userError);
      alert('Vous devez être connecté pour répondre.');
      return;
    }

    // Insérer la réponse avec l'author_id
    const { error } = await supabase.from('forum_replies').insert([
      { post_id: id, content: newReply, author_id: user.id },
    ]);

    if (error) {
      console.error('Erreur lors de l’ajout de la réponse :', error);
    } else {
      setNewReply('');
      const { data } = await supabase.from('forum_replies').select('*').eq('post_id', id);
      setReplies(data);
    }
  };

  if (!post) {
    return <div className="p-8 bg-gray-900 min-h-screen text-white">Chargement...</div>;
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-400 mb-6">{post.content}</p>
      <Button onClick={() => router.push('/forum')} className="mb-6 bg-indigo-500 hover:bg-indigo-600">
        Retour aux posts
      </Button>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Réponses</h2>
        <div className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="p-4 bg-gray-800 rounded-lg">
              <p>{reply.content}</p>
              <p className="text-sm text-gray-500 mt-2">Posté le {new Date(reply.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Ajouter une réponse..."
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Button onClick={handleAddReply} className="mt-4 bg-indigo-500 hover:bg-indigo-600">
            Répondre
          </Button>
        </div>
      </div>
    </div>
  );
}