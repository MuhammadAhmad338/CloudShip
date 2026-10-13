import type { NextRequest } from "next/server";
import { proxyBackendRequest } from "@/lib/server/backend-proxy";

export function GET(request: NextRequest) {
  return proxyBackendRequest(request, ["github", "repositories"]);
}
