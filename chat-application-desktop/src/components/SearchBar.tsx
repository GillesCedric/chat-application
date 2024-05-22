/**
 * Le composant SearchBar est utilisé pour afficher une barre de recherche dans l'interface utilisateur.
 * Il est composé d'un champ de saisie de texte où l'utilisateur peut saisir sa requête de recherche.
 * Le composant est conçu pour rechercher des prénoms ou des noms de famille dans une liste de données.
 * Il inclut également une icône de loupe pour lancer la recherche.
 * En résumé, le composant SearchBar offre une interface conviviale pour permettre à l'utilisateur d'effectuer des recherches dans l'application.
 * 
 * @module components/SearchBar
 */

import React from 'react';

/**
 * Composant SearchBar.
 * @returns {JSX.Element} Élément JSX représentant la barre de recherche.
 * @example
 * // Utilisation du composant SearchBar
 * <SearchBar />
 */
export const SearchBar: React.FC = (): JSX.Element => {
  return <SB1 />;
};

/**
 * Composant SB1 utilisé à l'intérieur de SearchBar pour afficher le formulaire de recherche.
 * @returns {JSX.Element} Élément JSX représentant le formulaire de recherche.
 * @example
 * // Utilisation du composant SB1
 * <SB1 />
 */
const SB1: React.FC = (): JSX.Element => {
  return (
    <form className="flex items-center max-w-lg mx-auto">
      <label htmlFor="voice-search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 21 21"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
            />
          </svg>
        </div>
        <input
          type="text"
          id="voice-search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search firstname or lastname here..."
          required
        />
        <button
          type="button"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          <svg
            className="w-4 h-4 text-blue-500 dark:text-blue-400 hover:text-blue-900 dark:hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};
