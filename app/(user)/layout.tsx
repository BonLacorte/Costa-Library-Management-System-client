"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Loader2 } from "lucide-react";
import { clearAuthSession, fetchCurrentUser, getAuthToken, hasRole, storeAuthUser } from "@/lib/auth";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function verifyUserSession() {
      const token = getAuthToken();
      if (!token) {
        router.replace("/sign-in");
        return;
      }

      try {
        const user = await fetchCurrentUser();
        if (!hasRole(user, "ROLE_USER")) {
          clearAuthSession();
          router.replace("/sign-in");
          return;
        }

        if (isMounted) {
          storeAuthUser(user);
          setIsAuthorized(true);
        }
      } catch {
        clearAuthSession();
        router.replace("/sign-in");
      }
    }

    verifyUserSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-surface-container-lowest">
        <Loader2 className="size-10 animate-spin text-primary opacity-60 mb-4" />
        <p className="text-on-surface-variant font-medium">Verifying session...</p>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 lg:ml-64 w-full h-full">
         {children}
      </div>
    </>
  );
}
