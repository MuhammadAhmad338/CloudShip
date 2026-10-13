import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthSession, AuthUser } from "@/lib/auth-session";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthState = {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  status: "loading",
  error: null,
};

export const fetchAuthSession = createAsyncThunk<
  AuthSession | null,
  void,
  { rejectValue: string }
>("auth/fetchSession", async (_, { rejectWithValue }) => {
  let response: Response;
  try {
    response = await fetch("/api/auth/session", {
      credentials: "same-origin",
      cache: "no-store",
    });
  } catch {
    return rejectWithValue("Could not reach the authentication service.");
  }

  if (response.status === 401) return null;
  if (!response.ok) {
    return rejectWithValue(`Could not check your session (${response.status}).`);
  }
  try {
    return await response.json() as AuthSession;
  } catch {
    return rejectWithValue("The authentication service returned an invalid session.");
  }
});

export const signOut = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    let response: Response;
    try {
      response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });
    } catch {
      return rejectWithValue("Could not reach the authentication service.");
    }
    if (!response.ok) {
      return rejectWithValue(`Sign out failed (${response.status}).`);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInStarted(state) {
      state.status = "loading";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAuthSession.pending, (state) => {
        if (!state.user) state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAuthSession.fulfilled, (state, action) => {
        state.user = action.payload?.user ?? null;
        state.status = state.user ? "authenticated" : "unauthenticated";
        state.error = null;
      })
      .addCase(fetchAuthSession.rejected, (state, action) => {
        if (!state.user) state.status = "unauthenticated";
        state.error = action.payload ?? action.error.message ?? "Session check failed.";
      })
      .addCase(signOut.pending, (state) => {
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.status = "unauthenticated";
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.error = action.payload ?? action.error.message ?? "Sign out failed.";
      });
  },
});

export const { signInStarted } = authSlice.actions;
export default authSlice.reducer;
