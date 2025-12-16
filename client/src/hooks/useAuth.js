import { createContext, useContext } from "react";

export const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Context store must be used within a store provider");
  }
  return context;
};
