/**
 * Le composant ConversationHeader affiche l'en-tête d'une liste de messages dans une interface de chat. 
 * Il présente le nom de l'utilisateur, son statut en ligne/hors ligne, et l'URL de son avatar. 
 * En outre, il offre des fonctionnalités telles que la recherche, l'affichage des options supplémentaires, 
 * et la possibilité d'intégrer d'autres fonctionnalités via des boutons.
 * 
 * @module components/ConversationHeader
 */

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "./Avatar";

/**
 * Composant ConversationHeader.
 * 
 * @function ConversationHeader
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.name - Le nom de l'utilisateur.
 * @param {boolean} props.status - Le statut en ligne/hors ligne de l'utilisateur (true pour en ligne, false pour hors ligne).
 * @param {string} props.avatar - L'URL de l'avatar de l'utilisateur.
 * @returns {JSX.Element} Le composant ConversationHeader.
 */
const ConversationHeader = ({ name, status, avatar }: { name: string, status: boolean, avatar: string }): JSX.Element => {
  return (
    <div className="rounded-t-lg py-2 px-3 bg-white flex justify-between items-center border-b-2">
      <div className="flex items-center">
        <Avatar avatar={avatar} fullname={name} />
        <div className="ml-4">
          <p className="text-grey-darkest font-semibold">{name}</p>
          <p
            className={`text-grey-darker text-xs ${status ? "text-green-700" : "text-red-500"
              }`}
          >
            {status ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          type="button"
          className="p-2 text-gray-500 hover:bg-gray-200 rounded-full focus:outline-none"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <button
          type="button"
          className="p-2 text-gray-500 hover:bg-gray-200 rounded-full focus:outline-none"
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>
        <button
          type="button"
          className="p-2 text-gray-500 hover:bg-gray-200 rounded-full focus:outline-none"
        >
          {/* SVG icon or any other icon component */}
        </button>
      </div>
    </div>
  );
};

export default ConversationHeader;
