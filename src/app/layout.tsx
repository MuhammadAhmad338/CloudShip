import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource-variable/google-sans-flex/wght.css";
import "./globals.css";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { AppShell } from "@/components/app-shell";
import { AuthSessionProvider } from "@/components/auth-session-provider";
import { authOptions, isGitHubOAuthConfigured } from "@/lib/auth-options";

export const metadata: Metadata = {
    title: "CloudShip | GitHub Deployments",
    description: "Connect GitHub and track your project deployments.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = isGitHubOAuthConfigured()
        ? await getServerSession(authOptions)
        : null;
    return (
        <html lang="en">
            <body><AuthSessionProvider session={session}><AppShell>{children}</AppShell></AuthSessionProvider></body>
        </html>
    );
}