"use client";

import { useState } from "react";

export function QuestionList({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="border-t border-mocha/10">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.question} className="border-b border-mocha/10">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? -1 : index)}
            >
              <span className="text-base font-medium tracking-[-0.03em] sm:text-lg">{item.question}</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-mocha/15">
                <svg viewBox="0 0 16 16" className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? "rotate-45" : ""}`} aria-hidden="true">
                  <path d="M8 2 V14 M2 8 H14" fill="none" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </span>
            </button>
            {expanded ? <p className="max-w-xl pb-5 pr-12 text-sm leading-6 text-mocha/75">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
