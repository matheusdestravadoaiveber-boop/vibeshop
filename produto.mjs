// Vibe Shop: busca nome, foto e preço de um produto do Mercado Livre
// a partir do link de afiliado. Roda no Netlify em /api/produto?url=...
//
// Precisa de duas variáveis de ambiente no Netlify:
//   ML_CLIENT_ID      (o número do seu app)
//   ML_CLIENT_SECRET  (a chave secreta, nunca coloque ela no código)

let tokenCache = { token: null, exp: 0 };

const HOSTS_PERMITIDOS = [
  "mercadolivre.com", "mercadolivre.com.br",
  "mercadolibre.com", "meli.la"
];

function hostPermitido(u) {
  try {
    const h = new URL(u).hostname.toLowerCase();
    return HOSTS_PERMITIDOS.some(d => h === d || h.endsWith("." + d));
  } catch { return false; }
}

async function pegarToken() {
  if (tokenCache.token && Date.now() < tokenCache.exp) return tokenCache.token;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.ML_CLIENT_ID || "",
    client_secret: process.env.ML_CLIENT_SECRET || ""
  });
  const r = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body
  });
  if (!r.ok) throw new Error("token " + r.status + ": " + (await r.text()).slice(0, 200));
  const j = await r.json();
  tokenCache = { token: j.access_token, exp: Date.now() + Math.max(60, (j.expires_in || 3600) - 300) * 1000 };
  return tokenCache.token;
}

async function api(caminho, token) {
  const headers = { accept: "application/json" };
  if (token) headers.authorization = "Bearer " + token;
  const r = await fetch("https://api.mercadolibre.com" + caminho, { headers });
  if (!r.ok) throw new Error(caminho + " " + r.status);
  return r.json();
}

// Tenta com o token e, se der 401/403, tenta sem token
async function apiFlex(caminho, token) {
  try { return await api(caminho, token); }
  catch (e) {
    if (/ (401|403)$/.test(String(e.message))) return api(caminho, null);
    throw e;
  }
}

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function meta(html, nome) {
  const re1 = new RegExp('<meta[^>]+(?:property|name|itemprop)=["\']' + nome + '["\'][^>]*content=["\']([^"\']+)["\']', "i");
  const re2 = new RegExp('<meta[^>]+content=["\']([^"\']+)["\'][^>]*(?:property|name|itemprop)=["\']' + nome + '["\']', "i");
  const m = html.match(re1) || html.match(re2);
  return m ? m[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'") : null;
}

// Último recurso: lê título, foto e preço direto da página do produto
async function dadosDaPagina(url) {
  const r = await fetch(url, { redirect: "follow", headers: { "user-agent": UA, "accept-language": "pt-BR,pt;q=0.9" } });
  if (!r.ok) throw new Error("pagina " + r.status);
  const html = await r.text();
  const nome = meta(html, "og:title") || (html.match(/<h1[^>]*class="[^"]*ui-pdp-title[^"]*"[^>]*>([^<]+)</i) || [])[1];
  const imagem = meta(html, "og:image");
  let preco = parseFloat(meta(html, "price") || meta(html, "product:price:amount") || "");
  if (!preco) {
    const m = html.match(/"price"\s*:\s*([0-9]+(?:\.[0-9]+)?)/);
    if (m) preco = parseFloat(m[1]);
  }
  let antigo = null;
  const mo = html.match(/"original_price"\s*:\s*([0-9]+(?:\.[0-9]+)?)/);
  if (mo) antigo = parseFloat(mo[1]);
  if (!nome) throw new Error("pagina sem dados");
  return {
    nome: nome.replace(/\s*\|\s*Mercado Livre.*$/i, "").trim(),
    imagem: imagem ? fotoGrande(imagem) : null,
    preco: preco || null,
    precoAntigo: antigo && preco && antigo > preco ? antigo : null,
    freteGratis: /frete gr[aá]tis/i.test(html.slice(0, 200000)),
    disponivel: true
  };
}

// Segue o link curto de afiliado até a página do produto
async function abrirLink(u) {
  try {
    const r = await fetch(u, { redirect: "follow", headers: { "user-agent": UA } });
    const final = r.url || u;
    const html = /MLB-?\d{6,}/i.test(final) ? "" : (await r.text()).slice(0, 400000);
    return { final, texto: final + " " + html };
  } catch {
    return { final: u, texto: u };
  }
}

// Acha o código do anúncio (MLB...) ou do produto de catálogo (/p/MLB...)
function acharIds(texto) {
  const ids = {};
  const wid = texto.match(/[?&#](?:wid|item_id)=(MLB-?\d{6,})/i);
  if (wid) ids.item = wid[1].replace("-", "").toUpperCase();
  const p = texto.match(/\/p\/(MLB\d{5,})/i);
  if (p) ids.produto = p[1].toUpperCase();
  if (!ids.item && !ids.produto) {
    const m = texto.match(/MLB-?(\d{6,})/i);
    if (m) ids.item = "MLB" + m[1];
  }
  return ids;
}

function fotoGrande(url) {
  return (url || "").replace(/^http:/, "https:").replace(/-[A-Z]\.(jpg|webp)$/i, "-O.$1");
}

async function dadosDoItem(id, token) {
  const it = await apiFlex("/items/" + id, token);
  let preco = it.price, antigo = it.original_price;
  try {
    const sp = await apiFlex("/items/" + id + "/sale_price?context=channel_marketplace", token);
    if (sp && sp.amount) { preco = sp.amount; antigo = sp.regular_amount || antigo; }
  } catch { /* usa o preço do anúncio */ }
  return {
    nome: it.title,
    imagem: fotoGrande((it.pictures && it.pictures[0] && (it.pictures[0].secure_url || it.pictures[0].url)) || it.thumbnail),
    preco, precoAntigo: antigo && antigo > preco ? antigo : null,
    freteGratis: !!(it.shipping && it.shipping.free_shipping),
    disponivel: it.status === "active"
  };
}

async function dadosDoProduto(id, token) {
  const p = await apiFlex("/products/" + id, token);
  const bw = p.buy_box_winner || {};
  if (bw.item_id) {
    try {
      const d = await dadosDoItem(bw.item_id, token);
      return { ...d, nome: p.name || d.nome };
    } catch { /* continua com os dados do catálogo */ }
  }
  return {
    nome: p.name,
    imagem: fotoGrande(p.pictures && p.pictures[0] && p.pictures[0].url),
    preco: bw.price || null,
    precoAntigo: bw.original_price && bw.original_price > bw.price ? bw.original_price : null,
    freteGratis: !!(bw.shipping && bw.shipping.free_shipping),
    disponivel: !!bw.price
  };
}

export default async (req) => {
  const q = new URL(req.url).searchParams;
  const link = q.get("url") || "";
  const extra = q.get("produto") || "";
  const resp = (obj, status = 200, cache = true) => Response.json(obj, {
    status,
    headers: cache
      ? { "cache-control": "public, max-age=300", "netlify-cdn-cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" }
      : { "cache-control": "no-store" }
  });

  if (!hostPermitido(link) || (extra && !hostPermitido(extra))) {
    return resp({ erro: "Link precisa ser do Mercado Livre." }, 400, false);
  }
  if (!process.env.ML_CLIENT_ID || !process.env.ML_CLIENT_SECRET) {
    return resp({ erro: "Faltam as variáveis ML_CLIENT_ID e ML_CLIENT_SECRET no Netlify." }, 500, false);
  }

  const tentativas = [];
  try {
    const base = extra || link;
    let ids = acharIds(base);
    let paginaUrl = /MLB/i.test(base) ? base : null;
    if (!ids.item && !ids.produto) {
      const aberto = await abrirLink(base);
      ids = acharIds(aberto.texto);
      paginaUrl = aberto.final;
    }
    if (!ids.item && !ids.produto) return resp({ erro: "Não achei o produto nesse link." }, 404, false);

    let token = null;
    try { token = await pegarToken(); } catch (e) { tentativas.push(String(e.message)); }

    // 1) anúncio (items)
    if (ids.item) {
      try { return resp({ ok: true, via: "items", ...(await dadosDoItem(ids.item, token)) }); }
      catch (e) { tentativas.push(String(e.message)); }
    }
    // 2) catálogo (products)
    if (ids.produto) {
      try { return resp({ ok: true, via: "products", ...(await dadosDoProduto(ids.produto, token)) }); }
      catch (e) { tentativas.push(String(e.message)); }
    }
    // 3) página do produto
    const urls = [paginaUrl, ids.item ? "https://produto.mercadolivre.com.br/" + ids.item.replace(/^MLB/, "MLB-") : null].filter(Boolean);
    for (const u of urls) {
      try { return resp({ ok: true, via: "pagina", ...(await dadosDaPagina(u)) }); }
      catch (e) { tentativas.push(String(e.message)); }
    }
    return resp({ erro: "Falha ao buscar o produto.", detalhe: tentativas.join(" | "), ids }, 502, false);
  } catch (e) {
    return resp({ erro: "Falha ao buscar o produto.", detalhe: String(e.message || e), tentativas }, 502, false);
  }
};

export const config = { path: "/api/produto" };
