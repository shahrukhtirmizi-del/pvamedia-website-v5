"use client";

import { useEffect, useState } from "react";

/**
 * A thin bar at the very top of the page that fills left-to-right as you
 * scroll through the page. Small detail, but it's the kind of thing that
 * signals a site was actually designed, not assembled from a template.
 */
export default function ScrollProgress({ color = "#1F5233" }: { color?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none">
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: color,
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}
