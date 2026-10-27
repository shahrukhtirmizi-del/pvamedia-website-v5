"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, loadPixel, pixelAllowed } from "../../lib/tracking";

/** Loads the Meta Pixel once consent allows it, and reports client-side page changes. */
export default function MetaPixel() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (pixelAllowed()) loadPixel();

    function onChoice(e: Event) {
      const choice = (e as CustomEvent<string>).detail;
      if (choice === "accepted") {
        if (window.fbq) window.fbq("consent", "grant");
        else loadPixel();
      } else {
        window.fbq?.("consent", "revoke");
      }
    }
    window.addEventListener(CONSENT_EVENT, onChoice);
    return () => window.removeEventListener(CONSENT_EVENT, onChoice);
  }, []);

  // the first view is counted by loadPixel; later ones are client-side navigations
  useEffect(() => {
    if (lastPath.current !== null && lastPath.current !== pathname) {
      window.fbq?.("track", "PageView");
    }
    lastPath.current = pathname;
  }, [pathname]);

  return null;
}
