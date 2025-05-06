"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const supabaseUrl = 'https://hjvnggilhhnqcejlcipw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('forum_posts').select('*');
      if (error) {
        console.error('Erreur lors de la récupération des posts :', error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = () => {
    router.push('/forum/create'); // Redirige vers la page de création de post
  };

  const handleViewPost = (id) => {
    router.push(`/forum/${id}`); // Redirige vers la page du post spécifique
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      <Button onClick={handleCreatePost} className="mb-6 bg-indigo-500 hover:bg-indigo-600">
        Créer un nouveau post
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
            onClick={() => handleViewPost(post.id)}
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-400 mt-2">{post.content.substring(0, 100)}...</p>
            <p className="text-sm text-gray-500 mt-2">Vues : {post.view_count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}