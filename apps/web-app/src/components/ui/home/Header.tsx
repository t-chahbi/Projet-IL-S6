"use client";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/home/Button';
import EyesLogo from '@/components/ui/home/Eyes';

const verbs = ["Watch", "Listen", "Explore"];

export default function Header() {
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

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

      {/* Boutons à droite */}
      <div className="flex space-x-2">
        <Button>Sign up</Button>
        <Button>Login</Button>
        <Button>Upgrade</Button>
      </div>
    </div>
  );
}

export { Header };
