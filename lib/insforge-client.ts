import { createBrowserClient } from "@insforge/sdk/ssr";

type InsforgeBrowserClient = ReturnType<typeof createBrowserClient>;

let client: InsforgeBrowserClient | null = null;

function createInsforgeBrowserClient(): InsforgeBrowserClient {
  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

  if (!baseUrl || !anonKey) {
    throw new Error(
      "Missing InsForge baseUrl or anonKey. Pass baseUrl and anonKey to createBrowserClient() or set NEXT_PUBLIC_INSFORGE_URL and NEXT_PUBLIC_INSFORGE_ANON_KEY."
    );
  }

  return createBrowserClient({ baseUrl, anonKey });
}

function getInsforge(): InsforgeBrowserClient {
  if (!client) {
    client = createInsforgeBrowserClient();
  }
  return client;
}

/**
 * Lazy proxy so importing this module during Next.js prerender/build
 * does not call createBrowserClient until a method is actually used.
 */
export const insforge = new Proxy({} as InsforgeBrowserClient, {
  get(_target, prop, receiver) {
    const value = Reflect.get(getInsforge(), prop, receiver);
    return typeof value === "function" ? value.bind(getInsforge()) : value;
  },
});
