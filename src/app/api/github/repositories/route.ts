import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || !process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
    return NextResponse.json({ error: "GitHub OAuth is not configured." }, { status: 503 });
  }

  const token = await getToken({ req: request, secret });
  if (!token?.sub || !token.githubAccessToken) {
    return NextResponse.json({ error: "Sign in with GitHub to view repositories." }, { status: 401 });
  }

  const response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated&type=all", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token.githubAccessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "GitHub could not list repositories." }, { status: 502 });
  }

  const repositories = await response.json() as Array<{
    id: number;
    full_name: string;
    default_branch: string;
    private: boolean;
    html_url: string;
  }>;

  return NextResponse.json(repositories.map((repository) => ({
    id: repository.id,
    fullName: repository.full_name,
    defaultBranch: repository.default_branch,
    private: repository.private,
    url: repository.html_url,
  })));
}