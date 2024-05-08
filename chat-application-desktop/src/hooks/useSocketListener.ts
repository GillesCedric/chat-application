import { useState, useEffect } from "react";
import Socket from "../modules/socket/Socket";

export function useSocketListener(eventName: string) {
  const [eventTriggered, setEventTriggered] = useState(false);

  useEffect(() => {
    Socket.connect().then(() => {
      console.log("Socket connected");
      const handleEvent = () => {
        console.log(`Event ${eventName} triggered`);
        setEventTriggered(true);
      };
      Socket.socket.on(eventName, handleEvent);
      return () => {
        Socket.socket.off(eventName, handleEvent);
      };
    });
  }, [eventName]);

  return eventTriggered;
}
