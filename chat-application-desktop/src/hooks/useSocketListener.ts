import { useState, useEffect } from "react";
import Socket from "../modules/socket/Socket";
export function useSocketListener(eventName: string) {
  const [eventTriggered, setEventTriggered] = useState(false);

  useEffect(() => {
    /* Check if the socket is initialized */
    if (!Socket || !Socket.socket) {
      Socket.connect().then(() => {
        const handleEvent = () => {
          setEventTriggered(true);
          console.log("Listeners received new : " + eventName);
        };
        Socket.socket.on(eventName, handleEvent);
        return () => {
          Socket.socket.off(eventName, handleEvent);
        };
      });
    }
  }, [eventName]);

  return eventTriggered;
}
