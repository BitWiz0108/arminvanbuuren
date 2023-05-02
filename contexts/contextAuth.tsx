import { createContext, useContext, ReactNode } from "react";
import PropTypes from "prop-types";

import useAuth from "@/hooks/useAuth";

import { DEFAULT_USER } from "@/interfaces/IUser";

export const AuthContext = createContext({
  isLoading: false,
  isSignedIn: false,
  accessToken: "",
  user: DEFAULT_USER,
  checkAuth: async (token: string) => {
    return false;
  },
  signIn: async (username: string, password: string) => {
    return false;
  },
  signOut: async () => {},
  signUp: async (
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    return false;
  },
  resetPassword: async (email: string) => {
    return false;
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    isLoading,
    isSignedIn,
    accessToken,
    user,
    checkAuth,
    signIn,
    signOut,
    signUp,
    resetPassword,
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isSignedIn,
        accessToken,
        user,
        checkAuth,
        signIn,
        signOut,
        signUp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthValues = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
