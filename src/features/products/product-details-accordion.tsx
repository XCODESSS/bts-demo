"use client";
import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { readDetailPanels, serializeDetailPanels, withSearchValue, type DetailPanel } from "../../lib/interface-state";
import styles from "./product.module.css";

export function ProductDetailsAccordion({ descriptionLabel, notesLabel, description, notes }: {
  descriptionLabel: string; notesLabel: string; description: ReactNode; notes: ReactNode;
}) {
  const value = readDetailPanels(useSearchParams().toString());
  function change(panels: string[]) {
    const selected = panels.filter((panel): panel is DetailPanel => panel === "description" || panel === "notes");
    const href = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const next = withSearchValue(href, "details", serializeDetailPanels(selected));
    if (next !== href) window.history.pushState(null, "", next);
  }
  return <Accordion type="multiple" value={value} onValueChange={change} className={styles.detailsAccordion}>
    <AccordionItem value="description" className={styles.accordionItem}>
      <AccordionTrigger headingLevel={2} className={styles.accordionTrigger}>{descriptionLabel}</AccordionTrigger>
      <AccordionContent className={styles.accordionBody}>{description}</AccordionContent>
    </AccordionItem>
    <AccordionItem value="notes" className={styles.accordionItem}>
      <AccordionTrigger headingLevel={2} className={styles.accordionTrigger}>{notesLabel}</AccordionTrigger>
      <AccordionContent className={styles.accordionBody}>{notes}</AccordionContent>
    </AccordionItem>
  </Accordion>;
}
