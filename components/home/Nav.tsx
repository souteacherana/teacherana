"use client";

import { useState } from "react";
import { navLinks, links } from "@/lib/home-content";

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className={`nav ${open ? "nav-open" : ""}`}>
      <div className="nav-bar">
        <a href="#topo" className="logo" aria-label="Teacher Ana de Araújo — início" />
        <nav className="nav-links" aria-label="Principal">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a href={links.vaga} className="nav-cta">
            Quero minha vaga
          </a>
          <button
            className="nav-toggle"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
