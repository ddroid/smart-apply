import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";

export const createInsforgeServer = async () => {
  const cookieStore = await cookies();
  return createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: {
      get: (name: string) => {
        const cookie = cookieStore.get(name);
        return cookie ? cookie.value : undefined;
      },
      set: (name: string, value: string, options: any) => {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Handle error gracefully if called from Server Component
        }
      },
      remove: (name: string, options: any) => {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // Handle error gracefully if called from Server Component
        }
      },
    } as any,
  });
};
