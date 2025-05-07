"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/home/Button";

const supabaseUrl = "https://hjvnggilhhnqcejlcipw.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Erreur utilisateur :", userError);
      alert("Vous devez être connecté pour créer un post.");
      return;
    }

    const { error } = await supabase
      .from("forum_posts")
      .insert([{ title, content, author_id: user.id }]);

    if (error) {
      console.error("Erreur de création :", error);
    } else {
      router.push("/forum");
    }
  };

  return (
    <div className="p-8 bg-[#0e1525] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-teal-400">Créer un nouveau post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">
            Titre
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 text-white border border-teal-700 rounded-md placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-300">
            Contenu
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 text-white border border-teal-700 rounded-md placeholder-gray-400 focus:outline-none"
            rows={6}
          />
        </div>

        <Button type="submit">Créer</Button>
      </form>
    </div>
  );
}
