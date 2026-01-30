'use client';

/**
 * AgeVerification - Client Component
 * Modal de vérification d'âge (18+) affiché à l'entrée du site
 */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'fgpeople_age_verified';

export default function AgeVerification() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà confirmé son âge
    const isVerified = localStorage.getItem(STORAGE_KEY);
    if (!isVerified) {
      setIsVisible(true);
      // Empêcher le scroll du body
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
    document.body.style.overflow = '';
  };

  const handleLeave = () => {
    setIsLeaving(true);
    // Rediriger vers Google après une courte animation
    setTimeout(() => {
      window.location.href = 'https://www.google.com';
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${
        isLeaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Backdrop avec blur */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-2 sm:mx-4 bg-bg-secondary border border-border rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-accent-primary/20 to-accent-hover/20 px-4 sm:px-6 py-5 sm:py-8 text-center border-b border-border">
          {/* Logo/Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-bg-tertiary border-2 border-accent-primary flex items-center justify-center">
            <span className="text-3xl sm:text-4xl font-bold text-accent-primary">18+</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-2">
            Contenu réservé aux adultes
          </h1>
          <p className="text-text-secondary flex flex-wrap items-baseline justify-center gap-0 text-sm sm:text-base">
            <span className="text-accent-primary font-bold">F</span>
            <span className="text-[10px]">or</span>
            <span className="text-accent-primary font-bold ml-0.5">G</span>
            <span className="text-[10px]">ood</span>
            <span className="font-bold ml-1">People</span>
            <span className="ml-1 sm:ml-2">- Clubs libertins</span>
          </p>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <p className="text-text-secondary text-center mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
            Ce site contient des informations à caractère adulte destinées aux personnes majeures.
            En accédant à ce site, vous certifiez avoir <strong className="text-text-primary">18 ans ou plus</strong> et
            acceptez de consulter un contenu réservé aux adultes.
          </p>

          {/* Warning */}
          <div className="bg-bg-tertiary border border-border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-text-secondary text-center">
              <span className="text-accent-primary font-semibold">Avertissement :</span> L'accès à ce site est
              strictement interdit aux mineurs.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-accent-primary text-bg-primary font-bold rounded-lg hover:bg-accent-hover transition-all duration-200 hover:shadow-lg hover:shadow-accent-primary/20 text-center text-sm sm:text-base"
            >
              J'ai 18 ans ou plus
            </button>
            <button
              onClick={handleLeave}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-transparent border border-border text-text-secondary font-semibold rounded-lg hover:bg-bg-tertiary hover:text-text-primary transition-all duration-200 text-center text-sm sm:text-base"
            >
              Quitter le site
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-bg-tertiary border-t border-border">
          <p className="text-xs text-text-secondary text-center">
            En cliquant sur "J'ai 18 ans ou plus", vous acceptez nos{' '}
            <a href="/mentions-legales" className="text-accent-primary hover:underline">
              mentions légales
            </a>{' '}
            et notre{' '}
            <a href="/confidentialite" className="text-accent-primary hover:underline">
              politique de confidentialité
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
