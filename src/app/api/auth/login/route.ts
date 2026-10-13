import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.CLOUDSHIP_API_URL?.replace(/\/$/, "");
  if (!backendUrl) {
    return NextResponse.json(
      { error: "Backend connection is not configured on the frontend server." },
      { status: 503 },
    );
  }
  return NextResponse.redirect(new URL("/auth/github", backendUrl));
}
