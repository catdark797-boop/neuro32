import { createContext, useContext, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetMe, getGetMeQueryKey, logout as apiLogout } from '@workspace/api-client-react';

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  telegram: string | null;
  role: string;
  direction: string | null;
  goals: string | null;
  registeredAt: string;
};

type AuthContextType = {
  user: CurrentUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  invalidate: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: async () => {},
  invalidate: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();

  const { data: user, isLoading } = useGetMe({
    query: {
      retry: false,
      staleTime: 5 * 60 * 1000,
      // On 401, the hook throws — we catch it and return null
      throwOnError: false,
    },
  });

  const handleLogout = async () => {
    try { await apiLogout(); } catch { /* ignore */ }
    qc.removeQueries({ queryKey: getGetMeQueryKey() });
    qc.clear();
  };

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getGetMeQueryKey() });
  };

  return (
    <AuthContext.Provider value={{
      user: (user ?? null) as CurrentUser | null,
      isLoading,
      logout: handleLogout,
      invalidate,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(AuthContext);
}
