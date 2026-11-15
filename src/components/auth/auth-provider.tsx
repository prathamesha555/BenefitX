"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

import type { User } from "firebase/auth";

import {
  onAuthStateChanged,
  reload
} from "firebase/auth";

import { auth } from "@/lib/firebase";


interface AuthContextType {

  user: User | null;

  loading: boolean;

  refreshUser: () => Promise<void>;

}


const AuthContext =
  createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({
  children
}: {
  children: ReactNode;
}) {

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,

      (currentUser) => {

        setUser(currentUser);

        setLoading(false);

      },

      () => {

        setUser(null);

        setLoading(false);

      }
    );

    return unsubscribe;

  }, []);


  async function refreshUser() {

    const currentUser = auth.currentUser;

    if (!currentUser) {

      setUser(null);

      return;

    }

    await reload(currentUser);

    setUser(auth.currentUser);

  }


  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }

  return context;

}