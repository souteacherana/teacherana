/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { dmSans, instrumentSerif } from '@/lib/fonts';
import './bioh.css';

export const metadata: Metadata = {
  title: 'Teacher Ana | @souteacherana',
};

const AVATAR = 'https://dtfnsnlwyzhalvu7.public.blob.vercel-storage.com/BIO/ana.png';

/* Para adicionar, remover ou reordenar links, edite só esta lista. */
const LINKS: {
  href: string;
  img: string;
  label: string;
  title: string;
  featured?: boolean;
}[] = [
  {
    href: 'https://www.riseeducacao.com.br/led?utm_source=bioh&utm_medium=hnrq&utm_content=bioh',
    img: 'https://dtfnsnlwyzhalvu7.public.blob.vercel-storage.com/LP%20-%20LED/led.webp',
    label: 'GARANTA SUA VAGA',
    title: 'LUCRANDO COM ESCOLA DIGITAL',
    featured: true,
  },
  {
    href: 'https://teacherana.com.br/imersaorise2026?utm_source=bioh&utm_medium=hnrq&utm_content=bioh',
    img: 'https://dtfnsnlwyzhalvu7.public.blob.vercel-storage.com/imersao.webp',
    label: 'LOTE 03',
    title: 'IMERSÃO RISE 2026',
    featured: true,
  },
  {
    href: 'https://teacherana.com.br/diagnostico-de-precificacao/?utm_source=bioh&utm_medium=bioh&utm_content=bioh',
    img: 'https://dtfnsnlwyzhalvu7.public.blob.vercel-storage.com/BIO/vhs.png',
    label: 'Ferramenta gratuita',
    title: 'Diagnóstico do seu Preço',
  },
  {
    href: 'https://www.youtube.com/@souteacherana',
    img: 'https://dtfnsnlwyzhalvu7.public.blob.vercel-storage.com/BIO/yt4.png',
    label: 'Canal no YouTube',
    title: 'Clube do Meio-Dia',
  },
  {
    href: 'https://api.whatsapp.com/send?phone=556791286394&text=Hello!%20%E2%98%BA%EF%B8%8F%20Vi%20sobre%20a%20Sess%C3%A3o%20Diagn%C3%B3stica%20e%20tenho%20interesse.%20Como%20funciona%3F',
    img: 'https://dtfnsnlwyzhalvu7.public.blob.vercel-storage.com/BIO/whats5.png',
    label: 'Fale comigo',
    title: 'Agende sua Sessão Diagnóstico',
  },
];

export default function BioPage() {
  return (
    <div className={`bio ${dmSans.variable} ${instrumentSerif.variable}`}>
      {/* HERO */}
      <div className="hero">
        <div className="avatar-ring">
          <div className="avatar-inner">
            <img src={AVATAR} alt="Teacher Ana" />
          </div>
        </div>
        <h1 className="hero-name">
          <em>Links Importantes</em>
        </h1>
        <p className="hero-handle">@souteacherana</p>
        <span className="hero-tag">Mentora de professores</span>
        <div className="divider" />
      </div>

      {/* LINKS */}
      <div className="links">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={`card-banner${l.featured ? ' featured' : ''}`}
          >
            <img src={l.img} className="banner-img" alt="" />
            <div className="banner-body">
              <div className="banner-text">
                <p className="banner-label">{l.label}</p>
                <p className="banner-title">{l.title}</p>
              </div>
              <div className="banner-arrow">⬈</div>
            </div>
          </a>
        ))}
      </div>

      {/* BIO */}
      <div className="bio-section">
        <div className="bio-box">
          <p className="bio-label">Quem é</p>
          <p className="bio-name">Teacher Ana de Araújo</p>
          <p className="bio-text">
            <strong>
              Ana é mãe, esposa, empresária, e foi professora particular antes de ser qualquer
              outra coisa nessa lista. Começou dando aula em casa pra estar perto das filhas. O
              que era pra ser “um jeito de ganhar um extra” virou um negócio que cresceu,
              sustentou a família e mostrou uma verdade incômoda: dar aula boa não era
              suficiente. Faltava método, estrutura e coragem de cobrar o que valia. <br />
              <br />
              Desde 2021, ela ajuda professoras particulares a fazerem o mesmo caminho — sair da
              agenda lotada e mal paga pra construir um negócio que cresce mesmo quando elas não
              estão na frente da câmera.
            </strong>
          </p>
        </div>
      </div>

      <footer>© 2026 Teacher Ana · Todos os direitos reservados</footer>
    </div>
  );
}
