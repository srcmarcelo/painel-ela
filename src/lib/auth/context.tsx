'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../../../supabase';

interface AuthContextProps {
  signIn: ({ email, password }: { email: string; password: string }) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { replace } = useRouter();
  const path = usePathname();

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        replace('/login');
      } else if (['/login', '/'].includes(path)) {
        replace('/painel');
      }
    }
    getSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (!error) replace('/painel');

    console.log(error);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) replace('/login');

    console.log(error);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
