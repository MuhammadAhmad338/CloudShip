import { notFound } from "next/navigation";
import { AppPage } from "@/components/app-pages";

const routes = ["projects", "projects/new", "deployments", "environments", "activity", "settings"];

export default async function RoutedPage({ params }: { params: Promise<{ route: string[] }> }) {
  const { route } = await params;
  const path = route.join("/");
  if (!routes.includes(path) && !path.startsWith("projects/") && !path.startsWith("deployments/")) notFound();
  return <AppPage route={path} />;
}