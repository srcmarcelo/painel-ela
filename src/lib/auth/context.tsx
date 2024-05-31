'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from 'react';
import { supabase } from '../../../supabase';
import { AuthError } from '@supabase/supabase-js';

type User = {
  id: string;
  email: string;
};

interface AuthContextProps {
  signIn: ({ email, password }: { email: string; password: string }) => void;
  signOut: () => void;
  user?: User | null;
  error?: AuthError | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { replace } = useRouter();
  const path = usePathname();

  const [user, setUser] = useState<any>();
  const [signError, setSignError] = useState<AuthError | null>();

  useEffect(() => {
    async function getSession() {
      const { data, error } = await supabase.auth.getSession();
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (!userError && userData) setUser(userData.user);

      if (error || !data.session) {
        replace('/login');
      } else if (['/login', '/'].includes(path)) {
        replace('/painel');
      }

      if (!error && !userError) setSignError(null);
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
    const { error, data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.log(error);
      setSignError(error);
    } else {
      replace('/painel');
      setUser(data.user);
      setSignError(null);
    }
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
        user,
        error: signError,
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
