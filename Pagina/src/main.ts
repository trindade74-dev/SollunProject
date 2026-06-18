// @ts-ignore: Cannot find module './style.css'.
import "./style.css";
import { initParallax, initTilt } from "./parallax";
import { initSolLua } from "./sol-lua";

/* ============================================================
   Sollun — landing page interactions
   ============================================================ */

/** Espera o DOM estar pronto antes de ligar os comportamentos. */
function ready(fn: () => void): void {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn);
}

/** Ano atual no rodapé. */
function setYear(): void {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

/** Sombra/fundo do header ao rolar a página. */
function initHeaderScroll(): void {
  const header = document.getElementById("header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/** Menu mobile (hambúrguer). */
function initMobileNav(): void {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
}

/** Revela elementos com .reveal quando entram na viewport. */
function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.querySelectorAll<HTMLElement>(".card, .sector, .step, .stat").forEach(
            (child, i) => child.style.setProperty("--i", String(i))
          );
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
}

/** Anima os números das estatísticas (data-count) ao aparecerem. */
function initCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>("[data-count]");
  if (!counters.length) return;

  const animate = (el: HTMLElement) => {
    const target = Number(el.dataset.count ?? "0");
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => io.observe(el));
}

/** Validação simples + estado do formulário de lista de espera. */
function initWaitlist(): void {
  const form = document.getElementById("waitlistForm") as HTMLFormElement | null;
  const input = document.getElementById("email") as HTMLInputElement | null;
  const msg = document.getElementById("formMsg");
  if (!form || !input || !msg) return;

  const isValidEmail = (value: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = input.value.trim();

    if (!isValidEmail(email)) {
      msg.textContent = "Ops! Confira o seu e-mail e tente de novo.";
      msg.className = "waitlist__msg is-error";
      input.focus();
      return;
    }

    // TODO: integrar com backend / serviço de e-mail (ex.: Supabase, Mailchimp).
    msg.textContent = "Pronto! Você está na lista. Em breve entramos em contato. 🎉";
    msg.className = "waitlist__msg is-ok";
    form.reset();
  });
}

/** Loop de chat dinâmico para contatos desktop. */
type ChatStep =
  | { kind: "in" | "out"; text: string; delay: number }
  | { kind: "typing"; delay: number };

interface ContactData {
  avatar: string;
  name: string;
  subtitle: string;
  script: ChatStep[];
}

const contactScripts: Record<string, ContactData> = {
  sollun: {
    avatar: "S",
    name: "Sollun",
    subtitle: "Use Sollun · responde 24h",
    script: [
      { kind: "in", text: "Oi! Vocês estão abertos agora? 🌙", delay: 500 },
      { kind: "typing", delay: 800 },
      { kind: "out", text: "Oi! Estou aqui 24h pra te ajudar 😊", delay: 1100 },
      { kind: "out", text: "Quer ver o cardápio ou fazer um pedido?", delay: 1400 },
      { kind: "in", text: "Quero fazer um pedido!", delay: 1400 },
      { kind: "typing", delay: 700 },
      { kind: "out", text: "Perfeito! Já te mando as opções 🚀", delay: 1100 },
    ],
  },
  restaurante: {
    avatar: "R",
    name: "Restaurante Bella Vista",
    subtitle: "aberto agora · 11h - 23h",
    script: [
      { kind: "in", text: "Vocês entregam na minha região? 🍕", delay: 500 },
      { kind: "typing", delay: 800 },
      { kind: "out", text: "Claro! Entregamos em todo o bairro! 🎉", delay: 1100 },
      { kind: "out", text: "Qual é o seu endereço?", delay: 1200 },
      { kind: "in", text: "Rua das Flores, 123", delay: 1200 },
      { kind: "typing", delay: 700 },
      { kind: "out", text: "Perfeito! Entrega em 30 min 🚚", delay: 1100 },
    ],
  },
  clinica: {
    avatar: "C",
    name: "Clínica Saúde Total",
    subtitle: "atende seg-sex · 08h - 18h",
    script: [
      { kind: "in", text: "Preciso agendar uma consulta", delay: 500 },
      { kind: "typing", delay: 800 },
      { kind: "out", text: "Com prazer! Qual especialidade? 😊", delay: 1100 },
      { kind: "out", text: "• Clínico Geral\n• Dermatologia\n• Cardiologia", delay: 1200 },
      { kind: "in", text: "Dermatologia", delay: 1200 },
      { kind: "typing", delay: 700 },
      { kind: "out", text: "Amanhã às 10h? ✅", delay: 1100 },
    ],
  },
  ecommerce: {
    avatar: "E",
    name: "E-commerce ModaFácil",
    subtitle: "suporte 24/7",
    script: [
      { kind: "in", text: "Onde está meu pedido? 📦", delay: 500 },
      { kind: "typing", delay: 800 },
      { kind: "out", text: "Qual é o número do seu pedido?", delay: 1100 },
      { kind: "in", text: "Pedido #MF-8821", delay: 1200 },
      { kind: "typing", delay: 700 },
      { kind: "out", text: "Status: Em rota de entrega 🚚", delay: 1100 },
      { kind: "out", text: "Previsão: até 18h", delay: 1000 },
    ],
  },
};

let chatLoopTimers: number[] = [];

function initChatLoop(): void {
  const chatBody = document.getElementById("chatBody");
  const chatAvatar = document.querySelector(".chat__avatar") as HTMLElement;
  const chatNameEl = document.querySelector(".chat__header strong") as HTMLElement;
  const chatSubtitleEl = document.querySelector(".chat__header small") as HTMLElement;
  const contactItems = document.querySelectorAll<HTMLElement>(".contact-item");

  if (!chatBody || !chatAvatar || !chatNameEl || !chatSubtitleEl) {
    console.warn("Chat elements not found");
    return;
  }

  function startChatLoop(contactId: string): void {
    const data = contactScripts[contactId];
    if (!data || !chatBody) return;

    // Clear previous timers
    chatLoopTimers.forEach(clearTimeout);
    chatLoopTimers = [];

    // Update header
    chatAvatar.textContent = data.avatar;
    chatNameEl.textContent = data.name;
    chatSubtitleEl.textContent = data.subtitle;

    // Update active state
    contactItems.forEach((item) => {
      item.classList.toggle("is-active", item.dataset.contact === contactId);
    });

    // Start loop
    const runLoop = () => {
      chatBody.innerHTML = "";
      let total = 0;

      data.script.forEach((step) => {
        total += step.delay;
        const id = window.setTimeout(() => {
          if (step.kind === "typing") {
            const typing = document.createElement("div");
            typing.className = "bubble bubble--typing";
            typing.innerHTML = "<span></span><span></span><span></span>";
            typing.dataset.typing = "true";
            chatBody.appendChild(typing);
          } else {
            chatBody.querySelector('[data-typing="true"]')?.remove();
            const bubble = document.createElement("div");
            bubble.className = `bubble bubble--${step.kind}`;
            bubble.style.whiteSpace = "pre-line";
            bubble.textContent = step.text;
            chatBody.appendChild(bubble);
          }
          chatBody.scrollTop = chatBody.scrollHeight;
        }, total);
        chatLoopTimers.push(id);
      });

      // Loop again
      const loopId = window.setTimeout(() => {
        runLoop();
      }, total + 2600);
      chatLoopTimers.push(loopId);
    };

    runLoop();
  }

  // Attach click handlers
  contactItems.forEach((item) => {
    item.addEventListener("click", () => {
      startChatLoop(item.dataset.contact || "sollun");
    });
  });

  // Start with Sollun
  startChatLoop("sollun");
}

ready(() => {
  setYear();
  initHeaderScroll();
  initMobileNav();
  initReveal();
  initCounters();
  initWaitlist();
  initParallax();
  initTilt();
  initSolLua('solLuaCanvas');
  initChatLoop();
});
