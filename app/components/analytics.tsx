
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

export function Analytics() {
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    // Load Google Analytics script
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.gtag = function() {
        // @ts-ignore
        window.dataLayer = window.dataLayer || [];
        // @ts-ignore
        window.dataLayer.push(arguments);
      };

      window.gtag("js", new Date().toISOString());
      window.gtag("config", "G-XXXXXXXXXX", {
        page_path: pathname,
        user_id: (session?.user as any)?.id,
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "G-XXXXXXXXXX", {
        page_path: pathname,
        user_id: (session?.user as any)?.id,
      });
    }
  }, [pathname, session?.user?.id]);

  return null;
}
