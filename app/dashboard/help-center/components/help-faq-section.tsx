"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import type { HelpCenterCopy } from "./help-center-copy"

export function HelpFaqSection({ copy }: { copy: HelpCenterCopy["faq"] }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-background p-4 sm:p-5">
      <h2 className="font-heading text-sm font-semibold">{copy.title}</h2>
      <Accordion className="mt-4 rounded-xl border-border/70">
        {copy.items.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger className="px-3 py-3 text-[11px] hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="px-3 text-[10px] leading-4 text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
