/**
 * Le composant NotificationIcon est une fonction React qui représente une icône de notification, généralement utilisée pour indiquer à l'utilisateur s'il y a des notifications non lues.
 * L'icône est représentée par une cloche, et le nombre de notifications non lues est affiché à côté de l'icône lorsqu'il est supérieur à zéro.
 * Lorsque l'utilisateur clique sur l'icône, une fonction onClick est déclenchée pour ouvrir ou fermer le tiroir des notifications, généralement situé dans le coin supérieur droit de l'interface utilisateur.
 * Le style de l'icône et du badge de notification est conçu pour être accrocheur et facilement repérable par l'utilisateur.
 * En résumé, le composant NotificationIcon offre une manière visuellement attractive et fonctionnelle d'indiquer les notifications non lues à l'utilisateur.
 *
 * @module components/NotificationIcon
 */

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

/**
 * Propriétés pour le composant NotificationIcon.
 * @typedef {Object} NotificationIconProps
 * @property {number} count - Le nombre de notifications non lues.
 * @property {Function} onClick - Fonction à appeler lorsque l'utilisateur clique sur l'icône.
 */

/**
 * Composant NotificationIcon.
 * @param {NotificationIconProps} props - Les propriétés du composant.
 * @returns {JSX.Element} Élément JSX représentant l'icône de notification.
 */
const NotificationIcon: React.FC<{ count: number; onClick: () => void }> = ({
  count,
  onClick,
}) => {
  return (
    <button
      type="button"
      className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faBell} />
      <span className="sr-only">Notifications</span>
      {count > 0 && (
        <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
          {count}
        </div>
      )}
    </button>
  );
};

export default NotificationIcon;
