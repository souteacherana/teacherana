import Image from "next/image";
import type { CSSProperties } from "react";
import Nav from "@/components/home/Nav";
import Reveal from "@/components/home/Reveal";
import Carousel from "@/components/home/Carousel";
import Faq from "@/components/home/Faq";
import Icon from "@/components/home/Icon";
import { casos, dores, links, motivos, numeros, rise, rodape, sobre, workshop } from "@/lib/home-content";
import { cinzel, inter } from "@/lib/fonts";
import type { Metadata } from "next";
import "./home.css";

export const metadata: Metadata = {
  title: "Teacher Ana de Araújo — Estratégia de negócio para professores de idiomas",
  description:
    "A Teacher Ana ajuda professores de idiomas a construírem um negócio educacional lucrativo, estruturado e com autoridade no digital: turmas, posicionamento e Instagram que vende.",
};

export default function Home() {
  return (
    <div className={`home ${inter.variable} ${cinzel.variable}`}>
      <Nav />

      <a href={links.vaga} className="ribbon">
        Imersão Rise 2026 · [{rise.vagasVendidas}]% das vagas vendidas. <span>Garanta a sua ›</span>
      </a>

      <main id="topo">
        {/* HERO */}
        <section className="hero">
          <div className="hero-text">
            <p className="hero-eyebrow">Teacher</p>
            <h1>Ana de Araújo</h1>
            <p className="hero-sub">Pare de só dar aula. Construa um negócio.</p>
            <div className="hero-ctas">
              <a href="#formacoes" className="btn btn-light">
                Conheça as formações
              </a>
              <a href="#rise" className="link link-light">
                Imersão Rise ›
              </a>
            </div>
          </div>
          <div className="hero-media">
            <Image src="/home/palco.jpg" alt="" fill priority sizes="100vw" className="hero-bg" />
            <div className="hero-fade" />
            <Image
              src="/home/ana-recorte.png"
              alt="Teacher Ana de Araújo no palco da Imersão Rise"
              fill
              priority
              sizes="100vw"
              className="hero-ana"
            />
          </div>
        </section>

        {/* JORNADA */}
        <section className="jornada">
          <div className="jornada-in">
            <Reveal className="jornada-text">
              <h2 className="serif">
                Essa jornada é
                <br />
                <strong>para você</strong> que:
              </h2>
              <p>A maioria dos professores enfrenta as mesmas travas antes de estruturar seu negócio com a Rise.</p>
            </Reveal>
            <Reveal className="jornada-foto" delay={0.1}>
              <Image src="/home/ana-estudio.png" alt="Teacher Ana" fill sizes="(max-width: 900px) 100vw, 40vw" />
            </Reveal>
            <div className="dores">
              {dores.map((d, i) => (
                <Reveal key={d.n} className="dor" delay={0.1 + i * 0.08}>
                  <span className="dor-n">{d.n}</span>
                  <div>
                    <h3>{d.titulo}</h3>
                    <p>{d.texto}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* STATEMENT */}
        <section className="statement" id="formacoes">
          <Reveal>
            <h2 className="serif">
              Formações estratégicas
              <br />
              <strong>para professores de elite</strong>
            </h2>
            <p>
              Não vendemos cursos genéricos de prateleira. Desenvolvemos o empresário da educação com proximidade,
              diagnóstico cirúrgico e acompanhamento direto da Teacher Ana.
            </p>
          </Reveal>
        </section>

        {/* DESTAQUES */}
        <section className="destaques">
          <Reveal className="destaques-head container">
            <h2 className="title">Comece pelos destaques.</h2>
            <a href="#formacoes" className="link">
              Ver todas as formações ›
            </a>
          </Reveal>
          <Carousel />
        </section>

        {/* WORKSHOP */}
        <section className="workshop container" id="workshop">
          <div className="workshop-text">
            <Reveal>
              <p className="eyebrow">Workshop do mês · {workshop.mes}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="display">
                {workshop.titulo[0]}
                <br />
                {workshop.titulo[1]}
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="lead">{workshop.texto}</p>
            </Reveal>
            <Reveal className="infos" delay={0.24}>
              {workshop.infos.map((i) => (
                <div key={i.rotulo}>
                  <span className="eyebrow small">{i.rotulo}</span>
                  <strong>{i.valor}</strong>
                </div>
              ))}
            </Reveal>
            <Reveal className="cta-row" delay={0.32}>
              <a href={links.workshop} className="btn btn-dark">
                Garantir minha vaga
              </a>
              <span className="gold">Vagas limitadas</span>
            </Reveal>
          </div>
          <Reveal className="workshop-img" delay={0.15}>
            <Image src="/home/palco.jpg" alt="Palco da Imersão Rise" fill sizes="(max-width: 900px) 100vw, 40vw" />
            <div className="workshop-selo">
              <span>Ao vivo com</span>
              <strong>Teacher Ana de Araújo</strong>
            </div>
          </Reveal>
        </section>

        {/* IMERSÃO RISE */}
        <section className="rise" id="rise">
          <Image src="/home/rise.jpg" alt="" fill sizes="100vw" className="rise-bg" />
          <div className="rise-overlay" />
          <div className="rise-in container">
            <Reveal>
              <p className="eyebrow light">{rise.chamada}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2>
                <span className="rise-kicker">Imersão</span>
                Rise 2026
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="lead">{rise.texto}</p>
            </Reveal>
            <Reveal className="pilares" delay={0.24}>
              {rise.pilares.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </Reveal>
            <Reveal className="lotacao" delay={0.32}>
              <p className="eyebrow light small">[{rise.vagasVendidas}]% das vagas vendidas</p>
              <div className="bar">
                <div className="bar-fill" style={{ "--w": `${rise.vagasVendidas}%` } as CSSProperties} />
              </div>
            </Reveal>
            <Reveal className="cta-row" delay={0.4}>
              <a href={links.vaga} className="btn btn-light">
                Garantir minha vaga
              </a>
              <a href="#rise" className="btn btn-gold">
                Ver programação
              </a>
            </Reveal>
          </div>
        </section>

        {/* NÚMEROS */}
        <section className="numeros">
          <Reveal>
            <p className="eyebrow light">Em números</p>
            <h2 className="title">
              Uma clara demonstração
              <br />
              de resultado.
            </h2>
          </Reveal>
          <div className="numeros-grid">
            {numeros.map((n, i) => (
              <Reveal key={n.rotulo} delay={i * 0.08}>
                <strong>{n.valor}</strong>
                <span>{n.rotulo}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CASOS */}
        <section className="casos" id="casos">
          <div className="container">
            <Reveal className="center">
              <p className="eyebrow">Casos de sucesso</p>
              <h2 className="title">
                Teachers que pararam de
                <br />
                só dar aula.
              </h2>
            </Reveal>
            <div className="casos-grid">
              {casos.map((c, i) => (
                <Reveal key={i} className="caso" delay={i * 0.08}>
                  <div>
                    <strong className="caso-res">{c.resultado}</strong>
                    <span className="caso-leg">{c.legenda}</span>
                    <p>“{c.texto}”</p>
                  </div>
                  <div className="caso-pessoa">
                    <span className="avatar" />
                    <div>
                      <strong>{c.nome}</strong>
                      <span>{c.cargo}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="center">
              <a href={links.whatsapp} className="btn btn-dark">
                Quero ser o próximo caso
              </a>
            </Reveal>
          </div>
        </section>

        {/* SOBRE */}
        <section className="sobre container" id="sobre">
          <Reveal className="sobre-foto">
            <Image src="/home/ana-estudio.png" alt="Teacher Ana de Araújo" fill sizes="(max-width: 900px) 100vw, 40vw" />
          </Reveal>
          <div className="sobre-text">
            <Reveal>
              <p className="eyebrow">Sobre nós</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2>
                <span className="sobre-kicker">Teacher</span>
                Ana de Araújo
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="sobre-destaque">{sobre.destaque}</p>
              <p className="lead">{sobre.texto}</p>
            </Reveal>
            <Reveal className="infos" delay={0.24}>
              {sobre.numeros.map((n) => (
                <div key={n.rotulo}>
                  <strong className="serif-num">{n.valor}</strong>
                  <span>{n.rotulo}</span>
                </div>
              ))}
            </Reveal>
            <Reveal delay={0.32}>
              <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                Siga @souteacherana
              </a>
            </Reveal>
          </div>
        </section>

        {/* MOTIVOS */}
        <section className="motivos">
          <div className="container">
            <Reveal>
              <h2 className="title">
                Por que aprender com
                <br />a Teacher Ana.
              </h2>
            </Reveal>
            <div className="motivos-grid">
              {motivos.map((m, i) => (
                <Reveal key={m.titulo} className="motivo" delay={i * 0.08}>
                  <Icon name={m.icone} />
                  <h3>{m.titulo}</h3>
                  <p>{m.texto}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq" id="faq">
          <Reveal>
            <h2 className="title center">
              Perguntas? Nós temos
              <br />
              as respostas.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Faq />
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="crumb">
            <span className="logo logo-sm" aria-hidden />
            <span>›</span>
            <span>Início</span>
          </div>
          <div className="footer-cols">
            {rodape.map((col) => (
              <div key={col.titulo}>
                <h4>{col.titulo}</h4>
                <ul>
                  {col.itens.map((i) => (
                    <li key={i.label}>
                      <a href={i.href}>{i.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="legal">
            <span>Copyright © 2026 Teacher Ana de Araújo. Todos os direitos reservados.</span>
            <span>Política de privacidade &nbsp;|&nbsp; Termos de uso &nbsp;|&nbsp; Brasil</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
