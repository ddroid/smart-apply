import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@insforge/sdk/ssr";
import { createPostHogServer } from "@/lib/posthog-server";

export async function POST(req: NextRequest) {
  const posthog = createPostHogServer();
  const distinctId = req.headers.get("X-POSTHOG-DISTINCT-ID") ?? "anonymous";

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

    posthog.capture({
      distinctId,
      event: "auth_tokens_set",
    });
    await posthog.shutdown();

    return response;
  } catch (error) {
    console.error("[api/auth/set-tokens]", error);
    posthog.capture({
      distinctId,
      event: "auth_tokens_set_failed",
      properties: {
        error_message: error instanceof Error ? error.message : String(error),
      },
    });
    await posthog.shutdown();
    return NextResponse.json(
      { success: false, error: "Failed to set auth cookies" },
      { status: 500 }
    );
  }
}
