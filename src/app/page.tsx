import { AppPage } from "@/components/app-pages";
import { LandingPage } from "@/components/landing-page";
import { getBackendAuthSession } from "@/lib/server/auth-session";

export default async function Home() {
    const session = await getBackendAuthSession();
    return session ? <AppPage route="" /> : <LandingPage />;
}