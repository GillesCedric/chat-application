// context/AuthNavigationProvider.tsx
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useAuthNavigation } from "../utils/utilsFunctions";
import API from "../modules/api/API";

interface AuthNavigationProviderProps {
  children: ReactNode;
}

const AuthNavigationContext = createContext<{ redirectToSignIn: () => void }>({
  redirectToSignIn: () => {},
});

export const AuthNavigationProvider: React.FC<AuthNavigationProviderProps> = ({
  children,
}) => {
  const { redirectToSignIn } = useAuthNavigation();

  useEffect(() => {
    API.setNavigationContext({ redirectToSignIn });
  }, []);

  return (
    <AuthNavigationContext.Provider value={{ redirectToSignIn }}>
      {children}
    </AuthNavigationContext.Provider>  );
};

export const useAuthNavigationContext = () => useContext(AuthNavigationContext);
