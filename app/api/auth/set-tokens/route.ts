import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@insforge/sdk/ssr";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, refreshToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Access token is required" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });

    // Set cookies on our Next.js application domain
    setAuthCookies(response.cookies as any, {
      accessToken,
      refreshToken,
    });

    return response;
  } catch (error) {
    console.error("[api/auth/set-tokens]", error);
    return NextResponse.json(
      { success: false, error: "Failed to set auth cookies" },
      { status: 500 }
    );
  }
}
