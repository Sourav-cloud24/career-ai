"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import apiClient from "@/lib/apiClient";
import { authApi } from "@/features/auth/apis/auth.api";
import { clearAccessToken, setAccessToken } from "@/lib/authToken";

type User = {
  id: string | number;
  fullName?: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAuth = useCallback((user: User, accessToken: string) => {
    setAccessToken(accessToken);
    setUser(user);
  }, []);

  const clearAuth = useCallback(() => {
    clearAccessToken();
    setUser(null);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Refresh cookie is sent automatically by refreshClient.
        const refreshResponse = await authApi.refreshToken();

        const accessToken = refreshResponse.data.accessToken;

        setAccessToken(accessToken);

        // Now fetch the user using the new access token.
        const userResponse = await authApi.getCurrentUser();

        setUser(userResponse.data.user);
      } catch {
        // No valid refresh session: user is logged out.
        clearAccessToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        setAuth,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
