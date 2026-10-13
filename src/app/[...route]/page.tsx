import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AppPage } from "@/components/app-pages";
import { authOptions, isGitHubOAuthConfigured } from "@/lib/auth-options";

const routes = ["projects", "projects/new", "deployments", "environments", "activity", "settings"];

export default async function RoutedPage({ params }: { params: Promise<{ route: string[] }> }) {
  const { route } = await params;
  const path = route.join("/");
  if (path === "login") return <AppPage route="login" />;
  if (!isGitHubOAuthConfigured()) redirect("/login");
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!routes.includes(path) && !path.startsWith("projects/") && !path.startsWith("deployments/")) notFound();
  return <AppPage route={path} />;
}