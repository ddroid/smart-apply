import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "@insforge/sdk/ssr";
import { createPostHogServer } from "@/lib/posthog-server";

export async function POST(req: NextRequest) {
  const posthog = createPostHogServer();

  try {
    const body = await req.json().catch(() => ({}));
    const distinctId: string = body.userId ?? "anonymous";

    const response = NextResponse.json({ success: true });

    // Clear access and refresh token cookies from the local domain
    clearAuthCookies(response.cookies as any);

    posthog.capture({
      distinctId,
      event: "auth_logout_completed",
    });
    await posthog.shutdown();

    return response;
  } catch (error) {
    console.error("[api/auth/logout]", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear auth cookies" },
      { status: 500 }
    );
  }
}
