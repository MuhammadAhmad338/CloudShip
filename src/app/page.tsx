import { getServerSession } from "next-auth";
import { AppPage } from "@/components/app-pages";
import { LandingPage } from "@/components/landing-page";
import { authOptions, isGitHubOAuthConfigured } from "@/lib/auth-options";

export default async function Home() {
    const oauthConfigured = isGitHubOAuthConfigured();
    const session = oauthConfigured ? await getServerSession(authOptions) : null;
    return session ? <AppPage route="" /> : <LandingPage />;
}