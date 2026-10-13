import { signInStarted } from "@/lib/store/auth-slice";
import type { AppDispatch } from "@/lib/store";

export function startGitHubSignIn(dispatch: AppDispatch) {
  dispatch(signInStarted());
  window.location.assign("/api/auth/login");
}
