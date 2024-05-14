/**
 * Le composant Home est une fonction React qui affiche une interface utilisateur pour ajouter un contact.
 * Il inclut un formulaire permettant à l'utilisateur de saisir un nom d'utilisateur et de soumettre ou annuler l'ajout du contact.
 * Le composant utilise Tailwind CSS pour le style, offrant une interface moderne et réactive.
 * 
 * @module components/Home
 */

import React from 'react'

/**
 * Composant Home.
 * @returns {JSX.Element} Élément JSX représentant l'interface d'ajout de contact.
 * @example
 * // Utilisation du composant Home
 * <Home />
 */
export default function Home(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex items-center justify-center h-screen bg-blue-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-6 text-blue-600">Add to Contacts</h2>

          <form>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600 text-sm font-medium">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
              >
                Add to Contacts
              </button>
              <button
                type="button"
                className="w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 focus:outline-none focus:shadow-outline-gray"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
