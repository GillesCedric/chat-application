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

/**
 * Contexte d'authentification pour gérer l'état de l'utilisateur authentifié.
 */
export const AuthContext = createContext<AuthContextType>({
  authUser: null,
  setAuthUser: () => { },
});

/**
 * Hook personnalisé pour utiliser le contexte d'authentification dans les composants de l'application.
 * @returns Le contexte d'authentification.
 */
export const useAuthContext = () => {
  return useContext(AuthContext);
};

type AuthContextProviderProps = {
  children: ReactNode;
};

/**
 * Fournit le contexte d'authentification aux composants enfants.
 * @param children Les composants enfants.
 * @returns Le fournisseur de contexte d'authentification.
 */
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [authUser, setAuthUser] = useState<AuthUser>(JSON.parse("null"));

  /**
   * Vérifie l'authentification de l'utilisateur et met à jour le contexte en conséquence.
   * @returns Le jeton d'accès si l'authentification réussit, `false` sinon.
   */
  const checkAuthentication = async () => {
    // Logique de vérification de l'authentification...
  };

  // Appel de la fonction de vérification d'authentification au chargement du composant
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
