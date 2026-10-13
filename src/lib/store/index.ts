import { configureStore } from "@reduxjs/toolkit";
import type { AuthSession } from "@/lib/auth-session";
import authReducer, { type AuthState } from "@/lib/store/auth-slice";

export function makeStore(session: AuthSession | null) {
  const auth: AuthState = {
    user: session?.user ?? null,
    status: session ? "authenticated" : "loading",
    error: null,
  };
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
