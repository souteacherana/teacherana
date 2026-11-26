"use client";

import { useEffect, useRef, useState } from "react";
import { formacoes } from "@/lib/home-content";
import Reveal from "./Reveal";

export default function Carousel() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // descobre qual card está em evidência conforme a rolagem
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
        setActive(cards.length - 1);
        return;
      }
      const left = el.scrollLeft + cards[0].offsetLeft;
      let best = 0;
      cards.forEach((c, i) => {
        if (Math.abs(c.offsetLeft - left) < Math.abs(cards[best].offsetLeft - left)) best = i;
      });
      setActive(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(formacoes.length - 1, i));
    const first = el.children[0] as HTMLElement;
    const card = el.children[idx] as HTMLElement;
    el.scrollTo({ left: card.offsetLeft - first.offsetLeft, behavior: "smooth" });
  };

  return (
    <>
      <Reveal className="tabs" delay={0.1}>
        {formacoes.map((f, i) => (
          <button key={f.aba} className={`tab ${i === active ? "tab-on" : ""}`} onClick={() => go(i)}>
            {f.aba}
          </button>
        ))}
      </Reveal>

      <div className="car-track" ref={track}>
        {formacoes.map((f, i) => (
          <Reveal key={f.titulo} className="car-card" from="right" delay={Math.min(i, 3) * 0.08}>
            <a href={f.href} className="car-card-in">
              <div>
                <p className="eyebrow">{f.categoria}</p>
                <h3>{f.titulo}</h3>
                <p className="car-text">{f.texto}</p>
              </div>
              <div className="car-base">
                <span className="car-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="car-plus" aria-hidden>
                  +
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="car-controls">
        <div className="dots" aria-hidden>
          {formacoes.map((f, i) => (
            <span key={f.aba} className={i === active ? "dot dot-on" : "dot"} />
          ))}
        </div>
        <div className="arrows">
          <button onClick={() => go(active - 1)} disabled={active === 0} aria-label="Anterior">
            ‹
          </button>
          <button onClick={() => go(active + 1)} disabled={active === formacoes.length - 1} aria-label="Próximo">
            ›
          </button>
        </div>
      </div>
    </>
  );
}
