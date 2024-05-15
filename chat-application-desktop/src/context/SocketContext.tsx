/**
 * Le module SocketContext fournit un contexte pour la gestion de la connexion WebSocket de l'application.
 * Il permet de vérifier l'état de la connexion, de s'abonner et de se désabonner aux événements WebSocket.
 * Le contexte de socket contient les valeurs suivantes :
 * - isConnected: Un booléen indiquant si la connexion WebSocket est établie.
 * - subscribe: Une fonction pour s'abonner à un événement WebSocket et définir un gestionnaire pour ce dernier.
 * - unsubscribe: Une fonction pour se désabonner d'un événement WebSocket et supprimer un gestionnaire pour ce dernier.
 * 
 * Le module expose également un hook personnalisé `useSocketContext` pour utiliser le contexte de socket dans les composants de l'application.
 *Le module expose également un hook personnalisé `useAuthContext` pour utiliser le contexte d'authentification dans les composants de l'application.
 * 
 * @module context/SocketContext
 */
import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from "react";
import Socket from "../modules/socket/Socket";
import { useAuthContext } from "./AuthContext";

type SocketContextType = {
  isConnected: boolean;
  subscribe: (event: string, handler: (data: any) => void) => void;
  unsubscribe: (event: string, handler: (data: any) => void) => void;
};

// Créer le contexte avec un objet par défaut
const SocketContext = createContext<SocketContextType | null>(null)

// Hook personnalisé pour utiliser le contexte d'authentification
export const useSocketContext = () => {
  return useContext(SocketContext);
};

type SocketContextProviderProps = {
  children: ReactNode;
};

// Fournisseur de contexte de socket
export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({
  children,
}) => {

  const { authUser } = useAuthContext()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const connectSocket = async () => {
      if (authUser) {
        await Socket.connect();
        setIsConnected(true);
      }
    };

    connectSocket();

    return () => {
      Socket.disconnect();
      setIsConnected(false);
    };
  }, [authUser]);

  const subscribe = (event: string, handler: (data: any) => void) => {
    if (Socket.socket && isConnected) {
      Socket.socket.on(event, handler);
    }
  };

  const unsubscribe = (event: string, handler: (data: any) => void) => {
    if (Socket.socket && isConnected) {
      Socket.socket.off(event, handler);
    }
  };

  return (
    <SocketContext.Provider value={{ isConnected, subscribe, unsubscribe }}>
      {children}
    </SocketContext.Provider>
  );
}

