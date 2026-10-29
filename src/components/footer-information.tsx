"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { Locale } from "../i18n/config";
import { getDictionary } from "../i18n/dictionaries";
import { readInformationTopic, withSearchValue, type InformationTopic } from "../lib/interface-state";
import { Icon } from "./icon";
import styles from "./footer-information.module.css";

export function FooterInformation({ locale, contactAction }: { locale: Locale; contactAction: ReactNode }) {
  const d = getDictionary(locale);
  const topic = readInformationTopic(useSearchParams().toString());
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const buttons = useRef<Partial<Record<InformationTopic, HTMLButtonElement>>>({});
  const opened = useRef<InformationTopic>("contact");
  const topics = {
    contact: { title: d.contactUs, copy: d.contactInfoBody },
    tracking: { title: d.trackOrder, copy: d.trackingInfoBody },
    shipping: { title: d.shippingInfo, copy: d.shippingInfoBody },
    returns: { title: d.returnsInfo, copy: d.returnsInfoBody },
  };
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (topic) {
      opened.current = topic;
      trigger.current = buttons.current[topic] || null;
      if (!element.open) element.showModal();
    } else if (element.open) element.close();
  }, [topic]);
  const visible = topics[topic || "contact"];
  function onClose() {
    if (dialog.current?.open) return;
    // A history-driven close must not replace the new URL or destroy Forward.
    if (readInformationTopic(window.location.search) === opened.current) {
      const href = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      window.history.replaceState(null, "", withSearchValue(href, "info", null));
    }
    trigger.current?.focus();
  }
  return <>
    <nav className="footer-links" aria-label={d.information}>
      <h2>{d.information}</h2>
      {(Object.keys(topics) as InformationTopic[]).map(key => <button type="button" key={key}
        ref={element => { if (element) buttons.current[key] = element; }}
        aria-haspopup="dialog" onClick={event => {
          trigger.current = event.currentTarget;
          const href = `${window.location.pathname}${window.location.search}${window.location.hash}`;
          window.history.pushState(null, "", withSearchValue(href, "info", key));
        }}>{topics[key].title}</button>)}
    </nav>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="footer-information-title"
      onClose={onClose} onClick={event => {
        if (event.target !== event.currentTarget) return;
        const b = event.currentTarget.getBoundingClientRect();
        if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.current?.close();
      }}>
      <div className={styles.heading}><h2 id="footer-information-title">{visible.title}</h2>
        <button type="button" className="icon-button" aria-label={d.closeInformation} onClick={() => dialog.current?.close()}><Icon name="close" /></button>
      </div>
      <p>{visible.copy}</p>{contactAction}
    </dialog>
  </>;
}
