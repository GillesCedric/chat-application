/**
 * Ce hook personnalisé permet de vérifier l'état de la connexion Internet.
 * Il utilise la bibliothèque `is-online` pour déterminer si l'utilisateur est connecté à Internet.
 * Il retourne un booléen indiquant l'état de la connexion.
 *
 * @module hooks/useCheckOnlineStatus
 */

import { useState, useEffect } from "react";
import isOnline from "is-online";

/**
 * Hook personnalisé pour vérifier l'état de la connexion Internet.
 * @returns Un booléen indiquant l'état de la connexion Internet (true si connecté, sinon false).
 */
export const useCheckOnlineStatus = (): boolean => {
  /**
   * État de la connexion Internet.
   * @type {boolean}
   */
  const [onlineStatus, setOnlineStatus] = useState<boolean>(true);

  useEffect(() => {
    // Définit une fonction asynchrone à l'intérieur de l'effet
    const checkOnlineStatus = async () => {
      const online = await isOnline();
      setOnlineStatus(online);
    };

    // Appelle la fonction asynchrone
    checkOnlineStatus();

    // Optionnellement, configure un intervalle pour vérifier régulièrement le statut
    const intervalId = setInterval(checkOnlineStatus, 3000); // Vérifier toutes les 3 secondes

    // Nettoie l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, []);

  return onlineStatus;
};
