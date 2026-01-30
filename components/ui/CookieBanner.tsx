'use client';

/**
 * CookieBanner - Client Component
 * Bannière de consentement aux cookies RGPD
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'fgpeople_cookie_consent';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Toujours activé
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait son choix
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Attendre un peu avant d'afficher la bannière
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setIsVisible(false);
    // Ici on pourrait déclencher des événements pour activer/désactiver les trackers
  };

  const handleAcceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleRejectAll = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-bg-secondary border border-border rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Main Banner */}
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-3 sm:gap-4">
            {/* Icon */}
            <div className="hidden md:flex w-12 h-12 rounded-full bg-accent-primary/10 items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-accent-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-text-primary mb-1 sm:mb-2">
                Nous respectons votre vie privée
              </h3>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                Nous utilisons des cookies pour améliorer votre expérience.{' '}
                <Link
                  href="/confidentialite"
                  className="text-accent-primary hover:underline"
                >
                  En savoir plus
                </Link>
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-accent-primary text-bg-primary font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 text-sm"
                >
                  Tout accepter
                </button>
                <button
                  onClick={handleRejectAll}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-transparent border border-border text-text-secondary font-semibold rounded-lg hover:bg-bg-tertiary hover:text-text-primary transition-all duration-200 text-sm"
                >
                  Tout refuser
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-transparent text-accent-primary font-semibold rounded-lg hover:bg-accent-primary/10 transition-all duration-200 text-sm flex items-center justify-center gap-2"
                >
                  Personnaliser
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showDetails ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        {showDetails && (
          <div className="border-t border-border bg-bg-tertiary p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Cookies nécessaires */}
              <div className="flex items-center justify-between p-2 sm:p-3 bg-bg-secondary rounded-lg border border-border gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-text-primary text-xs sm:text-sm">
                    Nécessaires
                  </h4>
                  <p className="text-text-secondary text-xs mt-0.5 hidden sm:block">
                    Essentiels au fonctionnement du site.
                  </p>
                </div>
                <div className="w-10 sm:w-12 h-5 sm:h-6 bg-accent-primary/30 rounded-full flex items-center justify-end px-1 cursor-not-allowed flex-shrink-0">
                  <div className="w-3 sm:w-4 h-3 sm:h-4 bg-accent-primary rounded-full" />
                </div>
              </div>

              {/* Cookies analytics */}
              <div className="flex items-center justify-between p-2 sm:p-3 bg-bg-secondary rounded-lg border border-border gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-text-primary text-xs sm:text-sm">
                    Analytiques
                  </h4>
                  <p className="text-text-secondary text-xs mt-0.5 hidden sm:block">
                    Comprendre l'utilisation du site.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPreferences({ ...preferences, analytics: !preferences.analytics })
                  }
                  className={`w-10 sm:w-12 h-5 sm:h-6 rounded-full flex items-center px-1 transition-colors duration-200 flex-shrink-0 ${
                    preferences.analytics
                      ? 'bg-accent-primary justify-end'
                      : 'bg-bg-tertiary border border-border justify-start'
                  }`}
                >
                  <div
                    className={`w-3 sm:w-4 h-3 sm:h-4 rounded-full transition-colors duration-200 ${
                      preferences.analytics ? 'bg-bg-primary' : 'bg-text-secondary'
                    }`}
                  />
                </button>
              </div>

              {/* Cookies marketing */}
              <div className="flex items-center justify-between p-2 sm:p-3 bg-bg-secondary rounded-lg border border-border gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-text-primary text-xs sm:text-sm">
                    Marketing
                  </h4>
                  <p className="text-text-secondary text-xs mt-0.5 hidden sm:block">
                    Publicités personnalisées.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPreferences({ ...preferences, marketing: !preferences.marketing })
                  }
                  className={`w-10 sm:w-12 h-5 sm:h-6 rounded-full flex items-center px-1 transition-colors duration-200 flex-shrink-0 ${
                    preferences.marketing
                      ? 'bg-accent-primary justify-end'
                      : 'bg-bg-tertiary border border-border justify-start'
                  }`}
                >
                  <div
                    className={`w-3 sm:w-4 h-3 sm:h-4 rounded-full transition-colors duration-200 ${
                      preferences.marketing ? 'bg-bg-primary' : 'bg-text-secondary'
                    }`}
                  />
                </button>
              </div>

              {/* Save button */}
              <div className="flex justify-end pt-1 sm:pt-2">
                <button
                  onClick={handleSavePreferences}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-accent-primary text-bg-primary font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 text-sm"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
