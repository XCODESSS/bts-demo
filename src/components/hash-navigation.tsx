"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Native hash navigation, corrected once fonts settle; no scroll interception or history override. */
export function HashNavigation() {
  const pathname = usePathname();
  useEffect(() => {
    let disposed = false;
    let frame = 0;
    function align() {
      const hash = window.location.hash;
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      void document.fonts.ready.then(() => {
        if (disposed || window.location.hash !== hash) return;
        frame = requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "auto" }));
      });
    }
    align();
    window.addEventListener("hashchange", align);
    return () => { disposed = true; cancelAnimationFrame(frame); window.removeEventListener("hashchange", align); };
  }, [pathname]);
  return null;
}
