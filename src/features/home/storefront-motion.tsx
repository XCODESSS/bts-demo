"use client";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./scroll-section.module.css";

/** Keep real section geometry/links server-rendered; animate paint, never replace page-sized placeholders. */
export function ScrollSection({ children, id }: { children: ReactNode; id: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      // An explicitly requested destination must not move while the visitor lands on it.
      if (window.location.hash === `#${id}` || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      element.firstElementChild?.classList.add("scroll-entry", "animate-in", "fade-in-50", "slide-in-from-bottom-3");
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [id]);
  return <div id={id} ref={root} className={styles.section} data-scroll-section><div>{children}</div></div>;
}
