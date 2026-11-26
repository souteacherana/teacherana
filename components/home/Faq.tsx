"use client";

import { useState } from "react";
import { faq } from "@/lib/home-content";

export default function Faq() {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  const all = open.size === faq.length;

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="faq-list">
      <button className="faq-all" onClick={() => setOpen(all ? new Set() : new Set(faq.map((_, i) => i)))}>
        {all ? "Recolher tudo –" : "Expandir tudo +"}
      </button>
      {faq.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={item.p} className={`faq-item ${isOpen ? "faq-open" : ""}`}>
            <button className="faq-q" aria-expanded={isOpen} onClick={() => toggle(i)}>
              <span>{item.p}</span>
              <span className="faq-icon" aria-hidden />
            </button>
            <div className="faq-a">
              <div>
                <p>{item.r}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
