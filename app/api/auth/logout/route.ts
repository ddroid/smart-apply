import { NextResponse } from "next/server";
import { clearAuthCookies } from "@insforge/sdk/ssr";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear access and refresh token cookies from the local domain
    clearAuthCookies(response.cookies as any);
    
    return response;
  } catch (error) {
    console.error("[api/auth/logout]", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear auth cookies" },
      { status: 500 }
    );
  }
}
