import type { NextRequest } from "next/server";
import { proxyBackendRequest } from "@/lib/server/backend-proxy";

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return proxyBackendRequest(request, path);
}

export const dynamic = "force-dynamic";
export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;