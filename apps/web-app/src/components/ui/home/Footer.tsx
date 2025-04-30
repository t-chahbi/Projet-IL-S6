// components/ui/home/Footer.jsx
import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-800 bg-opacity-50 py-4">
      <div className="container mx-auto text-center text-white">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Watch2Gether Clone. Tous droits réservés.
        </p>
        <div className="flex justify-center space-x-6 mt-2">
          <a href="#" className="hover:text-gray-300 text-sm">À propos</a>
          <a href="#" className="hover:text-gray-300 text-sm">Confidentialité</a>
          <a href="#" className="hover:text-gray-300 text-sm">Conditions d'utilisation</a>
          <a href="#" className="hover:text-gray-300 text-sm">Contact</a>
        </div>
      </div>
    </footer>
  );
};
