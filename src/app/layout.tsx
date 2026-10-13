
import "./globals.css";
import type { Metadata } from "next";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import { AppShell } from "@/components/app-shell";
import "@fontsource-variable/google-sans-flex/wght.css";
import { AuthSessionProvider } from "@/components/auth-session-provider";
import { getBackendAuthSession } from "@/lib/server/auth-session";

export const metadata: Metadata = {
    title: "CloudShip | GitHub Deployments",
    description: "Connect GitHub and track your project deployments.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await getBackendAuthSession();
    return (
        <html lang="en">
            <body><AuthSessionProvider session={session}><AppShell>{children}</AppShell></AuthSessionProvider></body>
        </html>
    );
}