import type { NextRequest } from "next/server";
import { proxyBackendRequest } from "@/lib/server/backend-proxy";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  return proxyBackendRequest(request, ["auth", "session"]);
}
