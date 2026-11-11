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
  const r = await fetch("https://api.mercadolibre.com" + caminho, {
    headers: { authorization: "Bearer " + token, accept: "application/json" }
  });
  if (!r.ok) throw new Error(caminho + " " + r.status);
  return r.json();
}

// Segue o link curto de afiliado até a página do produto
async function abrirLink(u) {
  try {
    const r = await fetch(u, {
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36" }
    });
    const final = r.url || u;
    const html = /MLB-?\d{6,}/i.test(final) ? "" : (await r.text()).slice(0, 400000);
    return final + " " + html;
  } catch {
    return u;
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
  const it = await api("/items/" + id, token);
  let preco = it.price, antigo = it.original_price;
  try {
    const sp = await api("/items/" + id + "/sale_price?context=channel_marketplace", token);
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
  const p = await api("/products/" + id, token);
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

  try {
    let ids = acharIds(extra || link);
    if (!ids.item && !ids.produto) ids = acharIds(await abrirLink(extra || link));
    if (!ids.item && !ids.produto) return resp({ erro: "Não achei o produto nesse link." }, 404, false);

    const token = await pegarToken();
    const dados = ids.item ? await dadosDoItem(ids.item, token) : await dadosDoProduto(ids.produto, token);
    return resp({ ok: true, ...dados });
  } catch (e) {
    return resp({ erro: "Falha ao buscar o produto.", detalhe: String(e.message || e) }, 502, false);
  }
};

export const config = { path: "/api/produto" };
