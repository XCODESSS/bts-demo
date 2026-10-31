"use client";
import Link from "next/link";
import { DesignPreview } from "./design-preview";
import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { getDictionary } from "../i18n/dictionaries";
import { usePathname, useSearchParams } from "next/navigation";
import { switchLocaleHref } from "../i18n/routing";
import type { Locale } from "../i18n/config";
import { Icon } from "./icon";

import { isDesign, designCanvas, type DesignId } from "./designs";
const storageKey = "bts-demo-design";
const designEvent = "bts-design-change";
let sessionDesign: DesignId | undefined;
let designTransition: ViewTransition | undefined;
let designMotionVersion = 0;
function transitionDesign(id: DesignId) {
  const version = ++designMotionVersion;
  designTransition?.skipTransition();
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion || id === readDesign()) {
    applyDesign(id, true);
    return;
  }
  if (typeof document.startViewTransition !== "function") {
    applyDesign(id, true);
    document
      .querySelector("main")
      ?.animate?.([{ opacity: 0.65 }, { opacity: 1 }], {
        duration: 300,
        easing: "cubic-bezier(.22,1,.36,1)",
      });
    return;
  }
  try {
    const transition = document.startViewTransition({
      types: ["design-switch"],
      update: () => {
        if (version === designMotionVersion) applyDesign(id, true);
      },
    });
    designTransition = transition;
    // Navigation or a hidden tab can cancel a snapshot, not the selected design.
    void transition.ready.catch(() => {});
    void transition.finished
      .catch(() => {})
      .finally(() => {
        if (designTransition === transition) designTransition = undefined;
      });
  } catch {
    applyDesign(id, true);
  }
}
function syncThemeColor(id: DesignId) {
  // Update after hydration: mutating React's viewport node in the head script
  // prevents metadata adoption and creates duplicate nodes during locale navigation.
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", designCanvas[id]);
}
function applyDesign(id: DesignId, persist = false) {
  sessionDesign = id;
  document.documentElement.setAttribute("data-design", id);
  syncThemeColor(id);
  if (persist) {
    try {
      localStorage.setItem(storageKey, id);
    } catch {
      /* The session preference still works if storage is blocked. */
    }
  }
  window.dispatchEvent(new Event(designEvent));
}
function restoreDesign() {
  let preferred = sessionDesign;
  if (!preferred) {
    try {
      const saved = localStorage.getItem(storageKey);
      if (isDesign(saved)) preferred = saved;
    } catch {
      /* Use the DOM's safe default when storage is unavailable. */
    }
  }
  applyDesign(preferred || readDesign());
}
function readDesign(): DesignId {
  const value = document.documentElement.dataset.design;
  return isDesign(value) ? value : "atelier";
}
function subscribeDesign(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== null) return;
    sessionDesign = isDesign(event.newValue) ? event.newValue : "atelier";
    document.documentElement.setAttribute("data-design", sessionDesign);
    syncThemeColor(sessionDesign);
    onChange();
  };
  window.addEventListener(designEvent, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(designEvent, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** A single text node, so each design keeps one semantic title and copy deck. */
export function DesignText({ classic, salon }: { classic: string; salon: string }) {
  const design = useSyncExternalStore(subscribeDesign, readDesign, () => "atelier");
  return design === "salon" || design === "gilded" || design === "noir" || design === "souk" || design === "verdant" ? salon : classic;
}

export function DesignChooser({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const current = useSyncExternalStore(
    subscribeDesign,
    readDesign,
    () => "atelier",
  );
  const pathname = usePathname();
  useLayoutEffect(() => {
    // Next may replace root-document attributes when changing locale layouts.
    // Restore the preference before paint, not only on a full-page reload.
    restoreDesign();
  }, [locale, pathname]);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const designs = [
    {
      id: "atelier",
      name: d.designAtelier,
      description: d.designAtelierDescription,
    },
    {
      id: "gallery",
      name: d.designGallery,
      description: d.designGalleryDescription,
    },
    { id: "linen", name: d.designLinen, description: d.designLinenDescription },
    { id: "salon", name: d.designSalon, description: d.designSalonDescription },
    { id: "gilded", name: d.designGilded, description: d.designGildedDescription },
    { id: "noir", name: d.designNoir, description: d.designNoirDescription },
    { id: "souk", name: d.designSouk, description: d.designSoukDescription },
    { id: "verdant", name: d.designVerdant, description: d.designVerdantDescription },
  ] as const;
  function selectDesign(id: DesignId) {
    // Exclude the chooser's exit frame from the website crossfade.
    dialog.current?.setAttribute("data-instant-close", "");
    dialog.current?.close();
    transitionDesign(id);
  }
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="design-trigger"
        aria-label={d.chooseDesign}
        aria-describedby="current-design-name"
        aria-haspopup="dialog"
        onClick={() => {
          dialog.current?.removeAttribute("data-instant-close");
          dialog.current?.showModal();
        }}
      >
        <span className="design-trigger-icon" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>
          <small>{d.designShort}</small>
          <strong id="current-design-name">
            {designs.find((design) => design.id === current)?.name}
          </strong>
        </span>
        <Icon name="plus" size={17} />
      </button>
      <dialog
        ref={dialog}
        data-motion-dialog
        className="design-dialog"
        aria-labelledby="design-dialog-title"
        aria-describedby="design-dialog-description"
        onClose={() => trigger.current?.focus()}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            dialog.current?.close();
        }}
      >
        <div className="design-dialog-heading">
          <div>
            <h2 id="design-dialog-title">{d.designTitle}</h2>
            <p id="design-dialog-description">{d.designHelp}</p>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label={d.closeDesign}
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="design-options">
          {designs.filter((design) => design.id !== "gallery" && design.id !== "linen").map((design) => (
            <button
              key={design.id}
              type="button"
              className="design-card"
              data-preview={design.id}
              aria-label={`${d.previewDesign} ${design.name}`}
              aria-pressed={current === design.id}
              onClick={() => selectDesign(design.id)}
            >
              <DesignPreview design={design.id} />
              <div className="design-card-copy">
                <div>
                  <h3>{design.name}</h3>
                  <span className="design-selected">
                    {current === design.id ? d.selectedDesign : d.previewDesign}
                  </span>
                </div>
                <p>{design.description}</p>
                <span className="design-palette" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            </button>
          ))}
        </div>
        <p className="design-criteria">{d.designCriteria}</p>
      </dialog>
    </>
  );
}

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const target = locale === "en" ? "ar" : "en";
  return (
    <Link
      className="language-switch"
      href={switchLocaleHref(pathname, search.toString(), target)}
      lang={target}
      hrefLang={target}
    >
      <Icon name="globe" size={17} />
      <span>{target === "ar" ? "العربية" : "English"}</span>
    </Link>
  );
}
