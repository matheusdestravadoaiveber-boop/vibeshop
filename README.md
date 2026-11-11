<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vibe Shop — Achados do Mercado Livre</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;800&display=swap">
<style>
:root{--y:#FFE600;--n:#2D3277;--ink:#1E1F3A;--muted:#55586F;--bg:#F5F5F7;--line:#E3E3EA}
*{box-sizing:border-box}
body{margin:0;font-family:Poppins,system-ui,sans-serif;color:var(--ink);background:var(--bg)}
a{color:inherit}
.wrap{max-width:1180px;margin:0 auto;padding:0 20px}
header{background:var(--y);position:sticky;top:0;z-index:5;border-bottom:1px solid rgba(45,50,119,.12)}
.top{display:flex;align-items:center;justify-content:space-between;gap:16px;height:72px}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none}
.brand .tile{width:44px;height:44px;border-radius:12px;background:var(--n);display:grid;place-items:center}
.brand b{font-size:26px;font-weight:800;letter-spacing:-1px;color:var(--n)}
.brand span{font-size:26px;font-weight:500;letter-spacing:-1px;color:var(--n)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:0 20px;border-radius:999px;font:600 15px Poppins,sans-serif;text-decoration:none;border:0;cursor:pointer;text-align:center}
.btn-n{background:var(--n);color:#fff}
.btn-n:hover{background:#23285f}
.btn-y{background:var(--y);color:var(--n)}
.btn-y:hover{background:#f2da00}
.hero{background:var(--y);padding:48px 0 64px}
.hero-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:40px;align-items:center}
.hero h1{margin:0 0 16px;font-size:clamp(32px,5vw,54px);line-height:1.08;font-weight:800;letter-spacing:-1.5px;color:var(--n)}
.hero p{margin:0 0 28px;font-size:18px;line-height:1.55;color:#2b2f5c;max-width:560px}
.hero .ctas{display:flex;flex-wrap:wrap;gap:12px}
.hero-art{display:grid;place-items:center}
.hero-art .big{width:min(320px,70vw);aspect-ratio:1;border-radius:72px;background:var(--n);display:grid;place-items:center}
.trust{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:-32px}
.trust div{background:#fff;border-radius:16px;padding:18px;display:flex;gap:12px;align-items:center;box-shadow:0 6px 20px rgba(30,31,58,.07)}
.trust svg{flex:none}
.trust strong{display:block;font-size:15px;color:var(--n)}
.trust small{font-size:13px;color:var(--muted)}
section{padding:56px 0}
h2{margin:0 0 8px;font-size:32px;font-weight:800;letter-spacing:-.8px;color:var(--n)}
.sub{margin:0 0 28px;color:var(--muted);font-size:16px}
.tools{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:24px}
.search{position:relative;flex:1 1 260px;display:flex;align-items:center;gap:8px;background:#fff;border:2px solid var(--line);border-radius:999px;padding:0 16px;min-height:48px}
.search:focus-within{border-color:var(--n)}
.search input{border:0;outline:0;font:400 15px Poppins,sans-serif;width:100%;background:transparent;color:var(--ink)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{white-space:nowrap;min-height:44px;padding:0 18px;border-radius:999px;border:2px solid var(--line);background:#fff;font:500 14px Poppins,sans-serif;color:var(--ink);cursor:pointer}
.chip[aria-pressed="true"]{background:var(--n);border-color:var(--n);color:#fff}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:20px}
.card{background:#fff;border-radius:18px;overflow:hidden;display:flex;flex-direction:column;border:1px solid var(--line);transition:transform .15s,box-shadow .15s}
.card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(30,31,58,.10)}
.thumb{aspect-ratio:1;background:#FFF9C4;display:grid;place-items:center;position:relative}
.thumb img{width:100%;height:100%;object-fit:cover}
.thumb .ph{display:flex;flex-direction:column;align-items:center;gap:6px;color:var(--n);font-size:13px;font-weight:500}
.tag{position:absolute;top:12px;left:12px;background:var(--n);color:#fff;font-size:12px;font-weight:600;padding:5px 10px;border-radius:999px}
.off{position:absolute;top:12px;right:12px;background:#00803E;color:#fff;font-size:12px;font-weight:600;padding:5px 10px;border-radius:999px}
.body{padding:16px;display:flex;flex-direction:column;gap:6px;flex:1}
.body h3{margin:0;font-size:15px;font-weight:500;line-height:1.4;color:var(--ink)}
.old{font-size:13px;color:var(--muted);text-decoration:line-through}
.price{font-size:24px;font-weight:600;color:var(--ink)}
.ship{font-size:13px;color:#00803E;font-weight:500}
.body .btn{margin-top:auto;width:100%}
.card.loading .thumb{animation:pulse 1.2s ease-in-out infinite}
@keyframes pulse{50%{opacity:.6}}
.empty{display:none;padding:40px;text-align:center;color:var(--muted);background:#fff;border-radius:18px}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.step{background:#fff;border-radius:18px;padding:24px;border:1px solid var(--line)}
.step .n{width:44px;height:44px;border-radius:50%;background:var(--y);color:var(--n);display:grid;place-items:center;font-weight:800;font-size:18px;margin-bottom:14px}
.step h3{margin:0 0 6px;font-size:18px;color:var(--n)}
.step p{margin:0;color:var(--muted);line-height:1.55;font-size:15px}
.zap{background:var(--n);color:#fff;border-radius:28px;padding:44px;display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:space-between}
.zap h2{color:#fff}
.zap p{margin:0;color:#D9DBF2;font-size:16px;max-width:560px;line-height:1.55}
footer{background:#fff;border-top:1px solid var(--line);padding:36px 0;margin-top:24px}
.foot{display:flex;flex-wrap:wrap;gap:24px;justify-content:space-between;align-items:flex-start}
.foot p{margin:6px 0 0;font-size:14px;color:var(--muted);max-width:620px;line-height:1.6}
.social{display:flex;gap:10px}
.social a{width:44px;height:44px;border-radius:50%;background:var(--bg);display:grid;place-items:center;color:var(--n)}
.social a:hover{background:var(--y)}
@media (max-width:860px){
.chips{flex-wrap:nowrap;overflow-x:auto;width:100%;padding-bottom:6px;scrollbar-width:none}
.chips::-webkit-scrollbar{display:none}
.hero-grid{grid-template-columns:1fr}
.hero-art{display:none}
.trust{grid-template-columns:1fr 1fr;margin-top:-24px}
.steps{grid-template-columns:1fr}
.zap{padding:28px}
}
@media (max-width:480px){.trust{grid-template-columns:1fr}}
</style>
</head>
<body>

<header>
<div class="wrap top">
<a class="brand" href="#inicio" aria-label="Vibe Shop, início">
<span class="tile"><svg width="34" height="34" viewBox="0 0 256 256" aria-hidden="true"><path d="M100 120 V80 a28 28 0 0 1 56 0 V120" fill="none" stroke="#FFE600" stroke-width="18" stroke-linecap="round"/><path d="M56 98 Q56 88 66 88 H190 Q200 88 200 98 L190 210 Q188 228 170 228 H86 Q68 228 66 210 Z" fill="#FFE600"/><path d="M86 172 q14 -26 28 0 t28 0 t28 0" fill="none" stroke="#2D3277" stroke-width="17" stroke-linecap="round"/></svg></span>
<b>vibe</b><span>shop</span>
</a>
</div>
</header>

<main id="inicio">
<div class="hero">
<div class="wrap hero-grid">
<div>
<h1>Os melhores achados do Mercado Livre, escolhidos pra você.</h1>
<p>A gente garimpa as ofertas que valem a pena. Você clica, compra direto no Mercado Livre e recebe em casa com a entrega e a garantia deles.</p>
<div class="ctas">
<a class="btn btn-n" href="#vitrine">Ver os achados</a>
</div>
</div>
<div class="hero-art" aria-hidden="true">
<div class="big"><svg width="68%" height="68%" viewBox="0 0 256 256"><path d="M100 120 V80 a28 28 0 0 1 56 0 V120" fill="none" stroke="#FFE600" stroke-width="14" stroke-linecap="round"/><path d="M56 98 Q56 88 66 88 H190 Q200 88 200 98 L190 210 Q188 228 170 228 H86 Q68 228 66 210 Z" fill="#FFE600"/><path d="M64 108 H192" stroke="#2D3277" stroke-width="5" stroke-linecap="round" opacity=".55"/><path d="M86 172 q14 -26 28 0 t28 0 t28 0" fill="none" stroke="#2D3277" stroke-width="13" stroke-linecap="round"/><path d="M216 30 Q219 47 236 50 Q219 53 216 70 Q213 53 196 50 Q213 47 216 30 Z" fill="#FFE600"/></svg></div>
</div>
</div>
</div>

<div class="wrap">
<div class="trust">
<div><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2D3277" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 6h13v10H1zM14 10h4l3 3v3h-7z"/><circle cx="5.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/></svg><span><strong>Entrega Mercado Livre</strong><small>Rápida e rastreada</small></span></div>
<div><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2D3277" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg><span><strong>Compra protegida</strong><small>Garantia do Mercado Livre</small></span></div>
<div><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2D3277" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg><span><strong>Pagamento seguro</strong><small>Feito no Mercado Livre</small></span></div>
<div><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2D3277" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z"/></svg><span><strong>Achados escolhidos</strong><small>Só o que vale a pena</small></span></div>
</div>
</div>

<section id="vitrine">
<div class="wrap">
<h2>Achados da semana</h2>
<p class="sub">Clique em "Ver oferta" para comprar direto no Mercado Livre.</p>
<div class="tools">
<label class="search">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55586F" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
<span class="sr">Buscar produto</span>
<input id="q" type="search" placeholder="Buscar produto...">
</label>
<div class="chips" id="chips" role="group" aria-label="Categorias"></div>
</div>
<div class="grid" id="grid"></div>
<p class="empty" id="empty">Nenhum achado aqui ainda. Novidades em breve!</p>
</div>
</section>

<section>
<div class="wrap">
<h2>Como funciona</h2>
<p class="sub">Simples, seguro e sem custo extra para você.</p>
<div class="steps">
<div class="step"><div class="n">1</div><h3>Escolha o achado</h3><p>Navegue pela vitrine e encontre a oferta que combina com você.</p></div>
<div class="step"><div class="n">2</div><h3>Compre no Mercado Livre</h3><p>O botão leva direto para o produto no Mercado Livre. O pagamento é feito lá, com toda a segurança.</p></div>
<div class="step"><div class="n">3</div><h3>Receba em casa</h3><p>A entrega é feita pelo Mercado Livre, com rastreio e a garantia deles.</p></div>
</div>
</div>
</section>

<section id="grupo">
<div class="wrap">
<div class="zap">
<div>
<h2>Ofertas relâmpago no WhatsApp</h2>
<p>Entre no grupo da Vibe Shop e receba os melhores achados do dia antes de todo mundo.</p>
</div>
<a class="btn btn-y" id="zapCta" href="#grupo">Quero entrar no grupo</a>
</div>
</div>
</section>
</main>

<footer>
<div class="wrap foot">
<div>
<a class="brand" href="#inicio" aria-label="Vibe Shop, voltar ao início"><b>vibe</b><span>shop</span></a>
<p>A Vibe Shop é uma página de indicações e participa do programa de afiliados do Mercado Livre: ao comprar pelos nossos links, podemos receber uma comissão, sem nenhum custo extra para você. Não somos o site oficial do Mercado Livre. Preços e disponibilidade podem mudar a qualquer momento; confira sempre na página do produto.</p>
</div>
<div class="social">
<a id="ig" href="#inicio" aria-label="Instagram"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
<a id="tt" href="#inicio" aria-label="TikTok"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.8 2.4 4.5 5 4.7"/></svg></a>
<a id="yt" href="#inicio" aria-label="YouTube"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg></a>
</div>
</div>
</footer>

<script>
const CONFIG = {
  whatsapp: "",   // link do grupo, ex: https://chat.whatsapp.com/...
  instagram: "",  // ex: https://instagram.com/vibeshop
  tiktok: "",
  youtube: ""
};

const CATEGORIAS = [
  "Moda Feminina", "Moda Masculina", "Moda Infantil", "Moda Fitness", "Moda Praia",
  "Sapatos", "Bolsas e Acessórios", "Relógios e Joias", "Beleza", "Perfumes", "Ferramentas"
];

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const brl = v => (typeof v === "number" && isFinite(v)) ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "";

function setLink(id, url){
  const a = document.getElementById(id);
  if (a && url){ a.href = url; a.target = "_blank"; a.rel = "noopener"; }
}
setLink("zapCta", CONFIG.whatsapp);
setLink("ig", CONFIG.instagram); setLink("tt", CONFIG.tiktok); setLink("yt", CONFIG.youtube);

let PRODUTOS = [];
let cat = "Todos";
const chips = document.getElementById("chips");
function renderChips(){
  const extras = [...new Set(PRODUTOS.map(p => p.categoria))].filter(c => c && !CATEGORIAS.includes(c));
  const cats = ["Todos", ...CATEGORIAS, ...extras];
  chips.innerHTML = cats.map(c => `<button class="chip" type="button" aria-pressed="${c===cat}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
}
chips.addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  cat = b.dataset.c;
  chips.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", x.dataset.c === cat));
  render();
});
document.getElementById("q").addEventListener("input", render);

const bagPh = `<svg width="56" height="56" viewBox="0 0 256 256" aria-hidden="true"><path d="M100 120 V80 a28 28 0 0 1 56 0 V120" fill="none" stroke="#2D3277" stroke-width="14" stroke-linecap="round"/><path d="M56 98 Q56 88 66 88 H190 Q200 88 200 98 L190 210 Q188 228 170 228 H86 Q68 228 66 210 Z" fill="#2D3277"/><path d="M86 172 q14 -26 28 0 t28 0 t28 0" fill="none" stroke="#FFF9C4" stroke-width="13" stroke-linecap="round"/></svg>`;

function card(p){
  const d = p.dados;
  const carregando = !d && !p.erro;
  const nome = d?.nome || (carregando ? "Carregando achado..." : "Achado do Mercado Livre");
  const off = d && d.precoAntigo && d.preco ? Math.round((1 - d.preco / d.precoAntigo) * 100) : 0;
  const img = d?.imagem
    ? `<img src="${esc(d.imagem)}" alt="${esc(nome)}" loading="lazy" referrerpolicy="no-referrer">`
    : `<div class="ph">${bagPh}<span>${carregando ? "Carregando..." : "Ver foto no Mercado Livre"}</span></div>`;
  return `<article class="card${carregando ? " loading" : ""}">
    <div class="thumb">${img}<span class="tag">${esc(p.categoria)}</span>${off >= 5 ? `<span class="off">${off}% OFF</span>` : ""}</div>
    <div class="body">
      <h3>${esc(nome)}</h3>
      ${d?.precoAntigo ? `<span class="old">${brl(d.precoAntigo)}</span>` : ""}
      <span class="price">${d?.preco ? brl(d.preco) : (carregando ? "" : "Confira o preço")}</span>
      <span class="ship">${d?.freteGratis ? "Frete grátis · " : ""}Entrega pelo Mercado Livre</span>
      <a class="btn btn-n" href="${esc(p.link)}" target="_blank" rel="sponsored noopener">Ver oferta no Mercado Livre</a>
    </div>
  </article>`;
}

function render(){
  const q = document.getElementById("q").value.trim().toLowerCase();
  const list = PRODUTOS.filter(p => (cat === "Todos" || p.categoria === cat) &&
    (!q || (p.dados?.nome || "").toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q)));
  const empty = document.getElementById("empty");
  empty.textContent = PRODUTOS.length ? "Nenhum achado aqui ainda. Novidades em breve!" : "Os achados estão chegando. Volte em breve!";
  empty.style.display = list.length ? "none" : "block";
  document.getElementById("grid").innerHTML = list.map(card).join("");
}

function numero(v){
  if (!v) return null;
  let t = String(v).replace(/[^\d.,]/g, "");
  if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
  const n = parseFloat(t);
  return isFinite(n) && n > 0 ? n : null;
}

/* Linha do produtos.txt:
   Categoria | link de afiliado | Nome | Preço | Preço antigo | Link da foto */
function lerLista(txt){
  return txt.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#")).map(l => {
    const c = l.split("|").map(x => (x || "").trim());
    const p = { categoria: c[0] || "Achados", link: c[1] || "" };
    const nome = c[2], preco = numero(c[3]), antigo = numero(c[4]), foto = c[5];
    if (nome) {
      p.dados = {
        nome,
        preco,
        precoAntigo: antigo && preco && antigo > preco ? antigo : null,
        imagem: /^https?:\/\//i.test(foto || "") ? foto : null,
        freteGratis: false
      };
    }
    return p;
  }).filter(p => /^https?:\/\//i.test(p.link));
}

async function carregar(){
  renderChips(); render();
  try {
    const r = await fetch("produtos.txt", { cache: "no-store" });
    if (!r.ok) throw 0;
    PRODUTOS = lerLista(await r.text());
  } catch { PRODUTOS = []; }
  renderChips(); render();
  await Promise.all(PRODUTOS.map(async p => {
    if (p.dados) return;
    try {
      const r = await fetch("/api/produto?url=" + encodeURIComponent(p.link));
      const j = await r.json();
      if (j.ok) p.dados = j; else p.erro = j.erro || "erro";
    } catch (e) { p.erro = "erro"; }
    render();
  }));
}
carregar();
</script>
</body>
</html>
