"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Provider } from "react-redux";
import type { AuthSession } from "@/lib/auth-session";
import { fetchAuthSession } from "@/lib/store/auth-slice";
import { makeStore, type AppStore } from "@/lib/store";
import { useAppSelector } from "@/lib/store/hooks";

export function AuthSessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: AuthSession | null;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) storeRef.current = makeStore(session);

  useEffect(() => {
    void storeRef.current?.dispatch(fetchAuthSession());
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}

export function useSession() {
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  return { data: user ? { user } : null, status };
}
