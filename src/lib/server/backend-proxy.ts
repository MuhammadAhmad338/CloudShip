import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function proxyBackendRequest(request: NextRequest, path: string[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in with GitHub to continue." }, { status: 401 });
  }

  const backendUrl = process.env.CLOUDSHIP_API_URL?.replace(/\/$/, "");
  const apiKey = process.env.CLOUDSHIP_API_KEY;
  if (!backendUrl || !apiKey) {
    return NextResponse.json(
      { error: "Backend connection is not configured on the frontend server." },
      { status: 503 },
    );
  }

  const encodedPath = path.map(encodeURIComponent).join("/");
  const targetUrl = new URL(`${backendUrl}/api/${encodedPath}`);
  targetUrl.search = request.nextUrl.search;

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...(request.headers.get("content-type")
          ? { "content-type": request.headers.get("content-type")! }
          : {}),
      },
      body: request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.text(),
      cache: "no-store",
    });

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "application/json",
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the CloudShip API." },
      { status: 502 },
    );
  }
}