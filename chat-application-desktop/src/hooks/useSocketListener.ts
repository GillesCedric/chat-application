/**
 * Ce hook personnalisé permet d'écouter un événement spécifique à partir d'une connexion WebSocket.
 * Il utilise le module `Socket` pour établir la connexion et écouter l'événement spécifié.
 * Il retourne un booléen indiquant si l'événement a été déclenché.
 *
 * @module hooks/useSocketListener
 */

import { useState } from "react";
import Socket from "../modules/socket/Socket";

/**
 * Hook personnalisé pour écouter un événement spécifique à partir d'une connexion WebSocket.
 * @param {string} eventName Le nom de l'événement à écouter.
 * @returns {boolean} Un booléen indiquant si l'événement a été déclenché.
 */
export function useSocketListener(eventName: string): boolean {
  /**
   * État indiquant si l'événement a été déclenché.
   * @type {boolean}
   */
  const [eventTriggered, setEventTriggered] = useState(false);

  // useEffect(() => {
  //   Socket.connect().then(() => {
  //     console.log("Socket connected");
  //     const handleEvent = () => {
  //       console.log(`Event ${eventName} triggered`);
  //       setEventTriggered(true);
  //     };
  //     Socket.socket.on(eventName, handleEvent);
  //     return () => {
  //       Socket.socket.off(eventName, handleEvent);
  //     };
  //   });
  // }, [eventName]);

  return eventTriggered;
}
