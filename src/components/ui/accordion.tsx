"use client";
// shadcn/ui new-york-v4 registry; the chevron uses a local SVG instead of another icon dependency.
// Source and MIT notice: docs/demo/SHADCN.md.
import type { ComponentProps } from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Accordion(props: ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}
function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("border-b last:border-b-0", className)} {...props} />;
}
function AccordionTrigger({ className, children, headingLevel = 3, ...props }: ComponentProps<typeof AccordionPrimitive.Trigger> & { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return <AccordionPrimitive.Header asChild><Heading className="m-0 flex">
    <AccordionPrimitive.Trigger data-slot="accordion-trigger"
      className={cn("flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-opacity outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg>g]:rotate-180", className)} {...props}>
      {children}
      <svg className="pointer-events-none size-4 shrink-0 text-muted-foreground"
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <g className="accordion-chevron"><path d="m6 9 6 6 6-6" /></g>
      </svg>
    </AccordionPrimitive.Trigger>
  </Heading></AccordionPrimitive.Header>;
}
function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return <AccordionPrimitive.Content data-slot="accordion-content"
    className="overflow-hidden text-sm" {...props}>
    <div className={cn("pt-0 pb-4", className)}>{children}</div>
  </AccordionPrimitive.Content>;
}
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
