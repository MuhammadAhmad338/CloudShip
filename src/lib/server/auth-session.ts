import "server-only";
import { cookies } from "next/headers";
import type { AuthSession } from "@/lib/auth-session";

export async function getBackendAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader.includes("cloudship_session=")) return null;

  const backendUrl = process.env.CLOUDSHIP_API_URL?.replace(/\/$/, "");
  if (!backendUrl) {
    throw new Error("CLOUDSHIP_API_URL is required to validate the backend session.");
  }

  const response = await fetch(`${backendUrl}/api/auth/session`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (response.status === 401) return null;
  if (!response.ok) {
    throw new Error(`Backend session validation failed (${response.status}).`);
  }
  return await response.json() as AuthSession;
}
