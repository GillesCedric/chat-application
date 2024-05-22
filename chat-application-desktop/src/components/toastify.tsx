/**
 * La fonction notify est une fonction utilitaire qui facilite la création et l'affichage de notifications à l'aide de la bibliothèque react-toastify.
 * Elle prend trois arguments :
 * - message: Le message de la notification à afficher.
 * - type: Le type de la notification, pouvant être "info", "success", "warning", "error" ou "default" (par défaut).
 * - callback (optionnel) : Une fonction de rappel à exécuter lorsque la notification est fermée.
 * La fonction toast de react-toastify est utilisée pour afficher la notification avec les paramètres spécifiés, tels que le type, la position, la durée de fermeture automatique, etc.
 * En résumé, la fonction notify offre une manière simple et pratique d'afficher des notifications à l'utilisateur dans l'application, avec la possibilité de personnaliser le contenu et le comportement des notifications.
 *@module components/toastify
*/

import { Zoom, toast } from "react-toastify";

/**
 * Type de notification possible.
 */
export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "default";

/**
 * Affiche une notification à l'utilisateur.
 * @param message Le message de la notification à afficher.
 * @param type Le type de la notification.
 * @param callback Une fonction de rappel à exécuter lorsque la notification est fermée.
 */
export const notify = (
  message: string,
  type: NotificationType = "default",
  callback?: () => void
): void => {
  toast(message, {
    type: type,
    position: "top-right",
    autoClose: 2000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    transition: Zoom,
    onClose: () => {
      if (callback) callback();
    },
  });
};
