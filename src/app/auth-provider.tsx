// app/providers/auth-provider.tsx
"use client";

import { authClient } from "@/lib/client/auth-client";
import { createContext, useContext, ReactNode } from "react";

type Session = Awaited<ReturnType<typeof authClient.getSession>>["data"];

const AuthContext = createContext<{
  session: Session | null;
  isLoading: boolean;
}>({
  session: null,
  isLoading: true,
});

export function AuthProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: Session | null;
}) {
  // Хук вызывается только здесь, в провайдере
  const { data: session, isPending } = authClient.useSession();

  return (
    <AuthContext.Provider value={{ session, isLoading: isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

// Кастомный хук для использования сессии в любом компоненте
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}