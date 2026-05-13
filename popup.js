const RAW_URL = "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies.json";
const STORE = {
  customProxies: "proxyflow.customProxies",
  customMeta: "proxyflow.customMeta",
  favorites: "proxyflow.favorites"
};

const state = {
  proxies: [],
  filtered: [],
  favorites: new Set(),
  mode: "direct",
  selectedProxy: null,
  meta: window.PROXYFLOW_DEFAULT_META || {},
  search: "",
  protocol: "all",
  country: "all"
};

const COUNTRY_ALIASES = {
  US: ["usa", "us", "u.s", "u.s.a", "america", "united states", "my", "mỹ", "hoa ky", "hoa kỳ"],
  GB: ["uk", "gb", "great britain", "britain", "england", "anh", "vuong quoc anh", "vương quốc anh"],
  VN: ["vn", "vietnam", "viet nam", "việt nam"],
  JP: ["jp", "japan", "nhat", "nhật", "nhat ban", "nhật bản"],
  KR: ["kr", "korea", "south korea", "han", "hàn", "han quoc", "hàn quốc"],
  CN: ["cn", "china", "trung quoc", "trung quốc"],
  SG: ["sg", "singapore", "xin ga po"],
  TH: ["th", "thailand", "thai", "thái", "thai lan", "thái lan"],
  DE: ["de", "germany", "duc", "đức"],
  FR: ["fr", "france", "phap", "pháp"],
  CA: ["ca", "canada", "ca na da"],
  AU: ["au", "australia", "uc", "úc"],
  NL: ["nl", "netherlands", "ha lan", "hà lan"],
  RU: ["ru", "russia", "nga"],
  IN: ["in", "india", "an do", "ấn độ"],
  ID: ["id", "indonesia", "indo"],
  BR: ["br", "brazil", "braxin"],
  ES: ["es", "spain", "tay ban nha", "tây ban nha"],
  IT: ["it", "italy", "y", "ý"],
  PL: ["pl", "poland", "ba lan"]
};

const $ = (id) => document.getElementById(id);

const els = {
  statusText: $("statusText"),
  statusOrb: $("statusOrb"),
  directBtn: $("directBtn"),
  refreshBtn: $("refreshBtn"),
  checkIpBtn: $("checkIpBtn"),
  selectedProxy: $("selectedProxy"),
  totalCount: $("totalCount"),
  countryCount: $("countryCount"),
  fastCount: $("fastCount"),
  searchInput: $("searchInput"),
  protocolFilter: $("protocolFilter"),
  countryFilter: $("countryFilter"),
  randomCountryBtn: $("randomCountryBtn"),
  resultCount: $("resultCount"),
  updatedAt: $("updatedAt"),
  proxyList: $("proxyList")
};

init();

async function init() {
  bindEvents();
  await loadData();
  await loadRuntimeState();
  hydrateFilters();
  renderAll();
}

function bindEvents() {
  els.searchInput.addEventListener("input", () => {
    state.search = normalizeSearchText(els.searchInput.value);
    renderList();
  });

  els.protocolFilter.addEventListener("change", () => {
    state.protocol = els.protocolFilter.value;
    renderList();
  });

  els.countryFilter.addEventListener("change", () => {
    state.country = els.countryFilter.value;
    renderList();
  });

  els.directBtn.addEventListener("click", async () => {
    const res = await sendMessage({ type: "DIRECT_MODE" });
    if (res.ok) {
      state.mode = "direct";
      state.selectedProxy = null;
      renderStatus();
    } else {
      toast(res.error || "Không thể tắt proxy");
    }
  });

  els.refreshBtn.addEventListener("click", refreshOnline);
  els.checkIpBtn.addEventListener("click", openIpChecker);
  els.randomCountryBtn.addEventListener("click", applyRandomByCountry);
}

async function loadData() {
  const saved = await chrome.storage.local.get([STORE.customProxies, STORE.customMeta, STORE.favorites]);
  state.proxies = Array.isArray(saved[STORE.customProxies])
    ? saved[STORE.customProxies]
    : (window.PROXYFLOW_DEFAULT_PROXIES || []);
  state.meta = saved[STORE.customMeta] || window.PROXYFLOW_DEFAULT_META || {};
  state.favorites = new Set(saved[STORE.favorites] || []);
}

async function loadRuntimeState() {
  const res = await sendMessage({ type: "GET_STATE" });
  if (res.ok) {
    state.mode = res.mode;
    state.selectedProxy = res.selectedProxy;
  }
}

function hydrateFilters() {
  const protocols = [...new Set(state.proxies.map((p) => p.protocol))].sort();
  const countries = [...new Set(state.proxies.map((p) => p.country).filter(Boolean))].sort();

  els.protocolFilter.innerHTML = `<option value="all">Tất cả giao thức</option>` +
    protocols.map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p.toUpperCase())}</option>`).join("");

  els.countryFilter.innerHTML = `<option value="all">Tất cả quốc gia</option>` +
    countries.map((c) => {
      const sample = state.proxies.find((p) => p.country === c);
      const code = sample?.countryCode ? ` (${escapeHtml(sample.countryCode)})` : "";
      const viHint = countryAliasLabel(sample?.countryCode, c);
      return `<option value="${escapeHtml(c)}">${escapeHtml(c)}${code}${viHint}</option>`;
    }).join("");
}

function renderAll() {
  renderStats();
  renderStatus();
  renderList();
}

function renderStats() {
  const countries = new Set(state.proxies.map((p) => p.countryCode || p.country).filter(Boolean));
  els.totalCount.textContent = state.proxies.length.toLocaleString("vi-VN");
  els.countryCount.textContent = countries.size.toLocaleString("vi-VN");
  els.fastCount.textContent = state.proxies.filter((p) => Number(p.timeout) <= 1).length.toLocaleString("vi-VN");
  els.updatedAt.textContent = state.meta.updatedAt ? `Cập nhật: ${formatDate(state.meta.updatedAt)}` : "Offline data";
}

function renderStatus() {
  const active = state.mode === "fixed" && state.selectedProxy;
  els.statusOrb.classList.toggle("active", Boolean(active));
  els.statusText.textContent = active
    ? `Đang dùng ${state.selectedProxy.protocol.toUpperCase()} • ${state.selectedProxy.host}:${state.selectedProxy.port}`
    : "Đang ở Direct Mode - không dùng proxy";

  els.selectedProxy.innerHTML = active
    ? proxySummary(state.selectedProxy)
    : "Chưa chọn proxy. Hãy bấm nút ⚡ trên một proxy để áp dụng.";
}

function renderList() {
  const q = state.search;
  state.filtered = state.proxies
    .filter((p) => state.protocol === "all" || p.protocol === state.protocol)
    .filter((p) => state.country === "all" || p.country === state.country)
    .filter((p) => !q || searchable(p).includes(q))
    .sort((a, b) => favoriteScore(b) - favoriteScore(a) || Number(a.timeout) - Number(b.timeout))
    .slice(0, 120);

  els.resultCount.textContent = `${state.filtered.length.toLocaleString("vi-VN")} proxy hiển thị`;

  if (!state.filtered.length) {
    els.proxyList.innerHTML = `<article class="proxy-card"><div class="proxy-main"><strong>Không tìm thấy proxy phù hợp</strong><div class="proxy-meta">Thử đổi bộ lọc hoặc bấm cập nhật online.</div></div></article>`;
    return;
  }

  els.proxyList.innerHTML = state.filtered.map(proxyCard).join("");
  els.proxyList.querySelectorAll("[data-apply]").forEach((btn) => {
    btn.addEventListener("click", () => applyProxy(Number(btn.dataset.apply)));
  });
  els.proxyList.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => copyProxy(Number(btn.dataset.copy)));
  });
  els.proxyList.querySelectorAll("[data-fav]").forEach((btn) => {
    btn.addEventListener("click", () => toggleFavorite(Number(btn.dataset.fav)));
  });
}

function proxyCard(proxy, index) {
  const id = proxyId(proxy);
  const fav = state.favorites.has(id) ? "★" : "☆";
  return `
    <article class="proxy-card">
      <div class="proxy-main">
        <strong>${escapeHtml(proxy.host)}:${proxy.port}</strong>
        <div class="proxy-meta">${escapeHtml(proxy.country || "Unknown")}${proxy.city ? ` • ${escapeHtml(proxy.city)}` : ""}<br>${escapeHtml(proxy.asnOrg || "ASN unknown")}</div>
        <div class="badges">
          <span class="badge ${escapeHtml(proxy.protocol)}">${escapeHtml(proxy.protocol.toUpperCase())}</span>
          <span class="badge">${escapeHtml(proxy.countryCode || "--")}</span>
          <span class="badge">${Number(proxy.timeout).toFixed(2)}s</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="icon-btn" data-apply="${index}" title="Áp dụng proxy">⚡</button>
        <button class="icon-btn" data-copy="${index}" title="Copy proxy">⧉</button>
        <button class="icon-btn" data-fav="${index}" title="Yêu thích">${fav}</button>
      </div>
    </article>`;
}

async function applyProxy(index) {
  const proxy = state.filtered[index];
  await applySelectedProxy(proxy);
}

async function copyProxy(index) {
  const p = state.filtered[index];
  await navigator.clipboard.writeText(`${p.protocol}://${p.host}:${p.port}`);
  toast("Đã copy proxy");
}

async function toggleFavorite(index) {
  const id = proxyId(state.filtered[index]);
  if (state.favorites.has(id)) state.favorites.delete(id);
  else state.favorites.add(id);
  await chrome.storage.local.set({ [STORE.favorites]: [...state.favorites] });
  renderList();
}

async function applyRandomByCountry() {
  if (state.country === "all") {
    toast("Hãy chọn một quốc gia trước khi random kết nối");
    els.countryFilter.focus();
    return;
  }

  const candidates = state.proxies
    .filter((p) => p.country === state.country)
    .filter((p) => state.protocol === "all" || p.protocol === state.protocol)
    .sort((a, b) => Number(a.timeout) - Number(b.timeout));

  if (!candidates.length) {
    toast("Không có proxy phù hợp cho quốc gia này");
    return;
  }

  const bestPoolSize = Math.min(20, candidates.length);
  const bestPool = candidates.slice(0, bestPoolSize);
  const proxy = bestPool[Math.floor(Math.random() * bestPool.length)];
  await applySelectedProxy(proxy, `Đã random ${proxy.country || state.country}`);
}

async function openIpChecker() {
  await chrome.tabs.create({ url: "https://whatismyipaddress.com/" });
}

async function applySelectedProxy(proxy, successMessage = "Đã áp dụng proxy") {
  const res = await sendMessage({ type: "APPLY_PROXY", proxy });
  if (res.ok) {
    state.mode = "fixed";
    state.selectedProxy = proxy;
    renderStatus();
    toast(successMessage);
  } else {
    toast(res.error || "Không thể áp dụng proxy");
  }
}

async function refreshOnline() {
  els.refreshBtn.disabled = true;
  els.refreshBtn.textContent = "Đang cập nhật...";
  try {
    const response = await fetch(RAW_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const raw = await response.json();
    const simplified = raw.map(simplifyProxy).filter(Boolean).sort((a, b) => Number(a.timeout) - Number(b.timeout));
    const meta = { source: RAW_URL, updatedAt: new Date().toISOString(), count: simplified.length };
    await chrome.storage.local.set({ [STORE.customProxies]: simplified, [STORE.customMeta]: meta });
    state.proxies = simplified;
    state.meta = meta;
    hydrateFilters();
    renderAll();
    toast(`Đã cập nhật ${simplified.length} proxy`);
  } catch (error) {
    toast(`Cập nhật lỗi: ${error.message}`);
  } finally {
    els.refreshBtn.disabled = false;
    els.refreshBtn.textContent = "Cập nhật online";
  }
}

function simplifyProxy(p) {
  if (!p || !p.protocol || !p.host || !p.port) return null;
  return {
    protocol: String(p.protocol).toLowerCase(),
    host: String(p.host),
    port: Number(p.port),
    timeout: Number(p.timeout || 0),
    exitIp: p.exit_ip || "",
    countryCode: p.geolocation?.country?.iso_code || "",
    country: p.geolocation?.country?.names?.en || "Unknown",
    city: p.geolocation?.city?.names?.en || "",
    continent: p.geolocation?.continent?.code || "",
    asnOrg: p.asn?.autonomous_system_organization || ""
  };
}

function sendMessage(message) {
  return chrome.runtime.sendMessage(message);
}

function searchable(p) {
  return normalizeSearchText([
    p.protocol,
    p.host,
    p.port,
    p.country,
    p.countryCode,
    p.city,
    p.asnOrg,
    p.exitIp,
    countryAliasesFor(p).join(" ")
  ].join(" "));
}

function countryAliasesFor(p) {
  const code = String(p.countryCode || "").toUpperCase();
  const aliases = COUNTRY_ALIASES[code] || [];
  return [code, p.country, ...aliases].filter(Boolean);
}

function countryAliasLabel(countryCode, countryName) {
  const aliases = COUNTRY_ALIASES[String(countryCode || "").toUpperCase()] || [];
  const preferred = aliases.find((alias) => /[à-ỹđ]/i.test(alias)) || aliases[0];
  if (!preferred || normalizeSearchText(preferred) === normalizeSearchText(countryName)) return "";
  return ` • ${escapeHtml(preferred)}`;
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9.]+/g, " ")
    .replace(/\s+/g, " ");
}

function proxyId(p) {
  return `${p.protocol}:${p.host}:${p.port}`;
}

function favoriteScore(p) {
  return state.favorites.has(proxyId(p)) ? 1 : 0;
}

function proxySummary(p) {
  return `<strong>${escapeHtml(p.protocol.toUpperCase())}://${escapeHtml(p.host)}:${p.port}</strong><br>${escapeHtml(p.country || "Unknown")}${p.city ? ` • ${escapeHtml(p.city)}` : ""} • ${Number(p.timeout).toFixed(2)}s`;
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function toast(message) {
  els.statusText.textContent = message;
  setTimeout(renderStatus, 1800);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
