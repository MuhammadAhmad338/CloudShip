import { NextResponse, type NextRequest } from "next/server";

export async function proxyBackendRequest(request: NextRequest, path: string[]) {
  const backendUrl = process.env.CLOUDSHIP_API_URL?.replace(/\/$/, "");
  if (!backendUrl) {
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
        ...(request.headers.get("cookie")
          ? { cookie: request.headers.get("cookie")! }
          : {}),
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
        ...(upstream.headers.get("set-cookie")
          ? { "set-cookie": upstream.headers.get("set-cookie")! }
          : {}),
      },
    });
  } catch (error) {
    console.error("Could not reach the CloudShip API", error);
    return NextResponse.json(
      { error: "Could not reach the CloudShip API." },
      { status: 502 },
    );
  }
}
