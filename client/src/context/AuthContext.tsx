import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AdminUser } from "../types";
import * as authApi from "../api/auth";

interface AuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .fetchCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const loggedInUser = await authApi.login(email, password);
    setUser(loggedInUser);
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
