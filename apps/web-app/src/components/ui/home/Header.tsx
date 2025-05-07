"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/home/Button";
import EyesLogo from "@/components/ui/home/Eyes";
import { createClient } from "@supabase/supabase-js";

const verbs = ["Watch", "Listen", "Explore"];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export default function Header() {
  const [text, setText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [user, setUser] = useState<any>(null);

  // Animation du verbe
  useEffect(() => {
    const currentWord = verbs[currentIndex];
    const typingSpeed = isDeleting ? 200 : 400;

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setText(currentWord.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
        if (charIndex === 0) {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % verbs.length);
        }
      } else {
        setText(currentWord.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
        if (charIndex === currentWord.length) {
          setIsDeleting(true);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentIndex]);

  // Récupération de l'utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) {
        setUser(data.user);
        console.log("Nom :", data.user?.user_metadata?.nom);
      }
    };

    fetchUser();
  }, []);

  // Déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-between w-full px-4 py-3">
      {/* Logo à gauche */}
      <EyesLogo />

      {/* Texte animé au centre */}
      <div className="text-center text-3xl font-bold font-mono text-white flex items-center gap-2">
        <span>{text}</span>
        <span className="animate-pulse">|</span>
        <span className="ml-1">together</span>
      </div>

      {/* Zone boutons / utilisateur à droite */}
      <div className="flex items-center space-x-2">
        {user ? (
          <>
            <span className="text-white text-lg font-semibold">
              {user.user_metadata?.nom ?? user.email}
            </span>
            <Button onClick={handleLogout}>Déconnexion</Button>
          </>
        ) : (
          <>
            <Button asChild>
              <a href="/auth/register">Sign up</a>
            </Button>
            <Button asChild>
              <a href="/auth/login">Login</a>
            </Button>
          </>
        )}
        <Button>Upgrade</Button>
        <Button asChild>
          <a href="/forum">Community</a>
        </Button>
      </div>
    </div>
  );
}

export { Header };
