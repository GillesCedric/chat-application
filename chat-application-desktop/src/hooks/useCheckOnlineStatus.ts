
import { useState, useEffect } from "react";
import isOnline from "is-online";
export const useCheckOnlineStatus = (): boolean => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(true);

  useEffect(() => {
    // Define an async function inside the effect
    const checkOnlineStatus = async () => {
      const online = await isOnline();
      setOnlineStatus(online);
    };

    // Call the async function
    checkOnlineStatus();


    // Optionally set up an interval to regularly check the status
    const intervalId = setInterval(checkOnlineStatus, 3000); // Check every 3 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return onlineStatus;
};
