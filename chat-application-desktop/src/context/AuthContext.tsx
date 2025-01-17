/**
 * Le module AuthContext fournit un contexte d'authentification pour l'application.
 * Il définit les types nécessaires pour représenter l'état de l'authentification de l'utilisateur ainsi que le contexte d'authentification lui-même.
 * Le contexte d'authentification contient deux valeurs :
 * - authUser: Représente l'utilisateur authentifié. Il peut être un objet contenant un jeton d'accès (`access_token`), `null` si aucun utilisateur n'est actuellement authentifié ou `false` s'il y a eu une erreur d'authentification.
 * - setAuthUser: Une fonction pour mettre à jour l'état de l'utilisateur authentifié.
 * 
 * Le module expose également un hook personnalisé `useAuthContext` pour utiliser le contexte d'authentification dans les composants de l'application.
 * 
 * @module context/AuthContext
 */

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import API from "../modules/api/API";

// Définir le type pour le contexte d'authentification
type AuthUser =
  | {
    access_token: string;
  }
  | null
  | boolean;

type AuthContextType = {
  authUser: AuthUser;
  setAuthUser: Dispatch<SetStateAction<AuthUser>>;
};

// Créer le contexte avec un objet par défaut
export const AuthContext = createContext<AuthContextType>({
  authUser: null,
  setAuthUser: () => { },
});

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuthContext = () => {
  return useContext(AuthContext);
};

type AuthContextProviderProps = {
  children: ReactNode;
};

// Fournisseur de contexte d'authentification
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [authUser, setAuthUser] = useState<AuthUser>(JSON.parse("null"));

  const checkAuthentication = async () => {
    const access_token = await window.electron.store.get(
      "chat-application-access_token"
    );
    const refresh_token = await window.electron.store.get(
      "chat-application-refresh_token"
    );

    const response = await API.checkAuthentication({
      access_token,
      refresh_token,
    });
    console.log(response);
    if (response && response.message) {
      return access_token;
    } else if (response.error && response.error == "Invalid access token") {
      const response2 = await API.refreshTokens({
        access_token,
        refresh_token,
      });
      if (response2 && response2.message) {
        window.electron.store.set(
          "chat-application-access_token",
          response2.access_token
        );
        window.electron.store.set(
          "chat-application-refresh_token",
          response2.refresh_token
        );
        return response2.access_token;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  checkAuthentication()
    .then((response: any) => {
      setAuthUser(response);
    })
    .catch((error: any) => { });

  if (authUser == null) {
    return <div>Chargement...</div>;
  } else {
    return (
      <AuthContext.Provider value={{ authUser, setAuthUser }}>
        {children}
      </AuthContext.Provider>
    );
  }
};
