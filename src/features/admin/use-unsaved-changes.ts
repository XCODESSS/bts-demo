"use client";
import { useEffect, useRef, useState, type RefObject } from "react";

function snapshot(form: HTMLFormElement): string {
  return JSON.stringify([...new FormData(form).entries()]
    .filter(([name]) => !name.startsWith("$ACTION_"))
    .map(([name, value]) => [name, String(value)] as const)
    .sort(([a, av], [b, bv]) => a.localeCompare(b) || av.localeCompare(bv)));
}

/** Covers document exits and ordinary links/forms, not same-document Router Back. */
export function useUnsavedChanges(form: RefObject<HTMLFormElement | null>): boolean {
  const baseline = useRef<string | null>(null);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    const element = form.current;
    if (!element) return;
    baseline.current ??= snapshot(element);
    const update = () => setDirty(snapshot(element) !== baseline.current);
    element.addEventListener("input", update);
    element.addEventListener("change", update);
    // Failed actions remount fields with their submitted values; keep the original baseline.
    const observer = new MutationObserver(update);
    observer.observe(element, { childList: true, subtree: true });
    return () => {
      element.removeEventListener("input", update);
      element.removeEventListener("change", update);
      observer.disconnect();
    };
  }, [form]);
  useEffect(() => {
    if (!dirty) return;
    let permittedUnload = false;
    const confirm = () => window.confirm("You have unsaved product changes. Leave without saving?");
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (permittedUnload) return;
      event.preventDefault(); event.returnValue = "";
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const target = new URL(anchor.href, location.href);
      if (!["http:", "https:"].includes(target.protocol)) return;
      if (target.origin === location.origin && target.pathname === location.pathname && target.search === location.search) return;
      if (!confirm()) { event.preventDefault(); event.stopPropagation(); }
      else permittedUnload = target.origin !== location.origin;
    };
    const submit = (event: SubmitEvent) => {
      if (event.target === form.current || event.defaultPrevented) return;
      if (!confirm()) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", click, true);
    document.addEventListener("submit", submit, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", click, true);
      document.removeEventListener("submit", submit, true);
    };
  }, [dirty, form]);
  return dirty;
}
