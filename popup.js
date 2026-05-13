const RAW_URL = "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies.json";
const STORE = {
  customProxies: "proxyflow.customProxies",
  customMeta: "proxyflow.customMeta",
  favorites: "proxyflow.favorites",
  language: "proxyflow.language"
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
  country: "all",
  view: "all",
  language: "vi"
};

const TRANSLATIONS = {
  vi: {
    eyebrow: "Smart Proxy Extension",
    currentConnection: "Kết nối hiện tại",
    live: "Live",
    randomTitle: "Random theo quốc gia",
    randomSubtitle: "Chọn nước, hệ thống tự lấy proxy tốt",
    checkIp: "Check IP",
    turnOff: "Tắt Proxy",
    refresh: "Cập nhật",
    refreshing: "Đang cập nhật...",
    totalProxy: "Tổng proxy",
    countries: "Quốc gia",
    fastProxy: "Proxy nhanh",
    quickSearch: "Tìm nhanh",
    searchPlaceholder: "Mỹ, USA, Nhật, Đức, host, ASN...",
    country: "Quốc gia",
    protocol: "Giao thức",
    allCountries: "Tất cả quốc gia",
    allProtocols: "Tất cả giao thức",
    searchTip: "Mẹo: gõ tiếng Việt không dấu vẫn tìm được. Ví dụ: <strong>my</strong>, <strong>nhat</strong>, <strong>duc</strong>.",
    all: "Tất cả",
    favorites: "Yêu thích",
    footerTip: "Chọn quốc gia → bấm random → Check IP. Public proxy có thể chết, hãy thử lại nếu chưa vào mạng.",
    directStatus: "Đang ở Direct Mode - không dùng proxy",
    activeStatus: "Đang dùng {protocol} • {host}:{port}",
    noSelected: "Chưa chọn proxy. Bấm ⚡ để áp dụng.",
    displayedSuffix: "proxy hiển thị",
    favoriteSuffix: "proxy yêu thích",
    emptyTitle: "Không tìm thấy proxy phù hợp",
    emptyHint: "Thử đổi bộ lọc hoặc bấm cập nhật online.",
    emptyFavTitle: "Chưa có proxy yêu thích",
    emptyFavHint: "Bấm nút ☆ trên proxy để lưu vào tab Yêu thích.",
    chooseCountry: "Hãy chọn một quốc gia trước khi random kết nối",
    noCountryProxy: "Không có proxy phù hợp cho quốc gia này",
    randomDone: "Đã random {country}",
    applied: "Đã áp dụng proxy",
    applyFailed: "Không thể áp dụng proxy",
    copied: "Đã copy proxy",
    updateDone: "Đã cập nhật {count} proxy",
    updateError: "Cập nhật lỗi: {error}",
    offlineData: "Offline data",
    updatedAt: "Cập nhật: {date}",
    applyTitle: "Áp dụng proxy",
    copyTitle: "Copy proxy",
    favoriteTitle: "Yêu thích",
    noProxy: "Không thể tắt proxy"
  },
  en: {
    eyebrow: "Smart Proxy Extension",
    currentConnection: "Current connection",
    live: "Live",
    randomTitle: "Random by country",
    randomSubtitle: "Pick a country, ProxyFlow chooses a good proxy",
    checkIp: "Check IP",
    turnOff: "Turn off",
    refresh: "Update",
    refreshing: "Updating...",
    totalProxy: "Total proxies",
    countries: "Countries",
    fastProxy: "Fast proxies",
    quickSearch: "Quick search",
    searchPlaceholder: "USA, Japan, Germany, host, ASN...",
    country: "Country",
    protocol: "Protocol",
    allCountries: "All countries",
    allProtocols: "All protocols",
    searchTip: "Tip: country aliases work too. Try <strong>USA</strong>, <strong>Japan</strong>, <strong>Germany</strong>.",
    all: "All",
    favorites: "Favorites",
    footerTip: "Choose country → random proxy → Check IP. Public proxies may fail; retry if needed.",
    directStatus: "Direct Mode - no proxy is being used",
    activeStatus: "Using {protocol} • {host}:{port}",
    noSelected: "No proxy selected. Click ⚡ to apply.",
    displayedSuffix: "shown proxies",
    favoriteSuffix: "favorite proxies",
    emptyTitle: "No matching proxy found",
    emptyHint: "Try changing filters or updating online.",
    emptyFavTitle: "No favorites yet",
    emptyFavHint: "Click ☆ on a proxy to save it here.",
    chooseCountry: "Choose a country before random connect",
    noCountryProxy: "No proxy available for this country",
    randomDone: "Randomized {country}",
    applied: "Proxy applied",
    applyFailed: "Could not apply proxy",
    copied: "Proxy copied",
    updateDone: "Updated {count} proxies",
    updateError: "Update failed: {error}",
    offlineData: "Offline data",
    updatedAt: "Updated: {date}",
    applyTitle: "Apply proxy",
    copyTitle: "Copy proxy",
    favoriteTitle: "Favorite",
    noProxy: "Could not turn off proxy"
  },
  zh: {
    eyebrow: "智能代理扩展",
    currentConnection: "当前连接",
    live: "实时",
    randomTitle: "按国家随机",
    randomSubtitle: "选择国家，自动挑选较快代理",
    checkIp: "检查 IP",
    turnOff: "关闭代理",
    refresh: "更新",
    refreshing: "正在更新...",
    totalProxy: "代理总数",
    countries: "国家",
    fastProxy: "快速代理",
    quickSearch: "快速搜索",
    searchPlaceholder: "美国、日本、德国、host、ASN...",
    country: "国家",
    protocol: "协议",
    allCountries: "所有国家",
    allProtocols: "所有协议",
    searchTip: "提示：可以使用国家别名，例如 <strong>USA</strong>、<strong>Japan</strong>、<strong>Germany</strong>。",
    all: "全部",
    favorites: "收藏",
    footerTip: "选择国家 → 随机代理 → 检查 IP。公共代理可能失效，请重试。",
    directStatus: "直连模式 - 未使用代理",
    activeStatus: "正在使用 {protocol} • {host}:{port}",
    noSelected: "尚未选择代理。点击 ⚡ 应用。",
    displayedSuffix: "个代理",
    favoriteSuffix: "个收藏代理",
    emptyTitle: "没有找到匹配的代理",
    emptyHint: "请尝试更改筛选条件或在线更新。",
    emptyFavTitle: "暂无收藏代理",
    emptyFavHint: "点击代理上的 ☆ 保存到收藏。",
    chooseCountry: "请先选择一个国家",
    noCountryProxy: "该国家没有可用代理",
    randomDone: "已随机选择 {country}",
    applied: "代理已应用",
    applyFailed: "无法应用代理",
    copied: "代理已复制",
    updateDone: "已更新 {count} 个代理",
    updateError: "更新失败：{error}",
    offlineData: "离线数据",
    updatedAt: "已更新：{date}",
    applyTitle: "应用代理",
    copyTitle: "复制代理",
    favoriteTitle: "收藏",
    noProxy: "无法关闭代理"
  },
  ru: {
    eyebrow: "Умное прокси-расширение",
    currentConnection: "Текущее подключение",
    live: "Live",
    randomTitle: "Случайно по стране",
    randomSubtitle: "Выберите страну, ProxyFlow подберет прокси",
    checkIp: "Проверить IP",
    turnOff: "Отключить",
    refresh: "Обновить",
    refreshing: "Обновление...",
    totalProxy: "Всего прокси",
    countries: "Страны",
    fastProxy: "Быстрые прокси",
    quickSearch: "Быстрый поиск",
    searchPlaceholder: "USA, Japan, Germany, host, ASN...",
    country: "Страна",
    protocol: "Протокол",
    allCountries: "Все страны",
    allProtocols: "Все протоколы",
    searchTip: "Совет: работают псевдонимы стран, например <strong>USA</strong>, <strong>Japan</strong>, <strong>Germany</strong>.",
    all: "Все",
    favorites: "Избранное",
    footerTip: "Выберите страну → случайный прокси → проверьте IP. Публичные прокси могут не работать.",
    directStatus: "Прямой режим - прокси не используется",
    activeStatus: "Используется {protocol} • {host}:{port}",
    noSelected: "Прокси не выбран. Нажмите ⚡.",
    displayedSuffix: "прокси показано",
    favoriteSuffix: "избранных прокси",
    emptyTitle: "Подходящие прокси не найдены",
    emptyHint: "Измените фильтры или обновите список.",
    emptyFavTitle: "Избранного пока нет",
    emptyFavHint: "Нажмите ☆ на прокси, чтобы сохранить его здесь.",
    chooseCountry: "Сначала выберите страну",
    noCountryProxy: "Для этой страны нет прокси",
    randomDone: "Выбран случайный {country}",
    applied: "Прокси применен",
    applyFailed: "Не удалось применить прокси",
    copied: "Прокси скопирован",
    updateDone: "Обновлено прокси: {count}",
    updateError: "Ошибка обновления: {error}",
    offlineData: "Офлайн данные",
    updatedAt: "Обновлено: {date}",
    applyTitle: "Применить прокси",
    copyTitle: "Копировать прокси",
    favoriteTitle: "В избранное",
    noProxy: "Не удалось отключить прокси"
  },
  es: {
    eyebrow: "Extensión proxy inteligente",
    currentConnection: "Conexión actual",
    live: "Live",
    randomTitle: "Aleatorio por país",
    randomSubtitle: "Elige un país y ProxyFlow selecciona un proxy",
    checkIp: "Ver IP",
    turnOff: "Apagar",
    refresh: "Actualizar",
    refreshing: "Actualizando...",
    totalProxy: "Proxies totales",
    countries: "Países",
    fastProxy: "Proxies rápidos",
    quickSearch: "Búsqueda rápida",
    searchPlaceholder: "USA, Japón, Alemania, host, ASN...",
    country: "País",
    protocol: "Protocolo",
    allCountries: "Todos los países",
    allProtocols: "Todos los protocolos",
    searchTip: "Consejo: también funcionan alias de país como <strong>USA</strong>, <strong>Japan</strong>, <strong>Germany</strong>.",
    all: "Todos",
    favorites: "Favoritos",
    footerTip: "Elige país → proxy aleatorio → verifica IP. Los proxies públicos pueden fallar.",
    directStatus: "Modo directo - sin proxy",
    activeStatus: "Usando {protocol} • {host}:{port}",
    noSelected: "Sin proxy. Haz clic en ⚡.",
    displayedSuffix: "proxies mostrados",
    favoriteSuffix: "proxies favoritos",
    emptyTitle: "No se encontraron proxies",
    emptyHint: "Cambia filtros o actualiza online.",
    emptyFavTitle: "Aún no hay favoritos",
    emptyFavHint: "Haz clic en ☆ para guardar un proxy aquí.",
    chooseCountry: "Elige un país antes de conectar aleatoriamente",
    noCountryProxy: "No hay proxy para este país",
    randomDone: "Aleatorio {country}",
    applied: "Proxy aplicado",
    applyFailed: "No se pudo aplicar el proxy",
    copied: "Proxy copiado",
    updateDone: "Actualizados {count} proxies",
    updateError: "Error al actualizar: {error}",
    offlineData: "Datos offline",
    updatedAt: "Actualizado: {date}",
    applyTitle: "Aplicar proxy",
    copyTitle: "Copiar proxy",
    favoriteTitle: "Favorito",
    noProxy: "No se pudo apagar el proxy"
  },
  fr: {
    eyebrow: "Extension proxy intelligente",
    currentConnection: "Connexion actuelle",
    live: "Live",
    randomTitle: "Aléatoire par pays",
    randomSubtitle: "Choisissez un pays, ProxyFlow prend un bon proxy",
    checkIp: "Vérifier IP",
    turnOff: "Désactiver",
    refresh: "Mettre à jour",
    refreshing: "Mise à jour...",
    totalProxy: "Proxys total",
    countries: "Pays",
    fastProxy: "Proxys rapides",
    quickSearch: "Recherche rapide",
    searchPlaceholder: "USA, Japon, Allemagne, host, ASN...",
    country: "Pays",
    protocol: "Protocole",
    allCountries: "Tous les pays",
    allProtocols: "Tous les protocoles",
    searchTip: "Astuce : les alias de pays fonctionnent aussi, ex. <strong>USA</strong>, <strong>Japan</strong>, <strong>Germany</strong>.",
    all: "Tous",
    favorites: "Favoris",
    footerTip: "Choisir pays → proxy aléatoire → vérifier IP. Les proxys publics peuvent échouer.",
    directStatus: "Mode direct - aucun proxy utilisé",
    activeStatus: "Utilisation de {protocol} • {host}:{port}",
    noSelected: "Aucun proxy. Cliquez sur ⚡.",
    displayedSuffix: "proxys affichés",
    favoriteSuffix: "proxys favoris",
    emptyTitle: "Aucun proxy trouvé",
    emptyHint: "Changez les filtres ou mettez à jour.",
    emptyFavTitle: "Aucun favori",
    emptyFavHint: "Cliquez sur ☆ pour enregistrer un proxy ici.",
    chooseCountry: "Choisissez d'abord un pays",
    noCountryProxy: "Aucun proxy pour ce pays",
    randomDone: "Proxy aléatoire {country}",
    applied: "Proxy appliqué",
    applyFailed: "Impossible d'appliquer le proxy",
    copied: "Proxy copié",
    updateDone: "{count} proxys mis à jour",
    updateError: "Erreur de mise à jour : {error}",
    offlineData: "Données hors ligne",
    updatedAt: "Mis à jour : {date}",
    applyTitle: "Appliquer proxy",
    copyTitle: "Copier proxy",
    favoriteTitle: "Favori",
    noProxy: "Impossible de désactiver le proxy"
  },
  ja: {
    eyebrow: "スマートプロキシ拡張",
    currentConnection: "現在の接続",
    live: "Live",
    randomTitle: "国別ランダム",
    randomSubtitle: "国を選ぶだけで良いプロキシを自動選択",
    checkIp: "IP確認",
    turnOff: "オフ",
    refresh: "更新",
    refreshing: "更新中...",
    totalProxy: "総プロキシ",
    countries: "国",
    fastProxy: "高速プロキシ",
    quickSearch: "クイック検索",
    searchPlaceholder: "USA, Japan, Germany, host, ASN...",
    country: "国",
    protocol: "プロトコル",
    allCountries: "すべての国",
    allProtocols: "すべてのプロトコル",
    searchTip: "ヒント：国名の別名も使えます。例 <strong>USA</strong>, <strong>Japan</strong>, <strong>Germany</strong>。",
    all: "すべて",
    favorites: "お気に入り",
    footerTip: "国を選択 → ランダム → IP確認。公開プロキシは失敗する場合があります。",
    directStatus: "ダイレクトモード - プロキシ未使用",
    activeStatus: "使用中 {protocol} • {host}:{port}",
    noSelected: "未選択。⚡ で適用。",
    displayedSuffix: "件表示",
    favoriteSuffix: "お気に入り",
    emptyTitle: "一致するプロキシがありません",
    emptyHint: "フィルター変更またはオンライン更新を試してください。",
    emptyFavTitle: "お気に入りはまだありません",
    emptyFavHint: "☆ をクリックしてここに保存します。",
    chooseCountry: "先に国を選択してください",
    noCountryProxy: "この国のプロキシはありません",
    randomDone: "{country} をランダム選択しました",
    applied: "プロキシを適用しました",
    applyFailed: "プロキシを適用できません",
    copied: "プロキシをコピーしました",
    updateDone: "{count} 件のプロキシを更新しました",
    updateError: "更新エラー: {error}",
    offlineData: "オフラインデータ",
    updatedAt: "更新: {date}",
    applyTitle: "プロキシ適用",
    copyTitle: "プロキシコピー",
    favoriteTitle: "お気に入り",
    noProxy: "プロキシをオフにできません"
  }
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
  allTabBtn: $("allTabBtn"),
  favoritesTabBtn: $("favoritesTabBtn"),
  languageSelect: $("languageSelect"),
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
      toast(t("noProxy"));
    }
  });

  els.refreshBtn.addEventListener("click", refreshOnline);
  els.checkIpBtn.addEventListener("click", openIpChecker);
  els.randomCountryBtn.addEventListener("click", applyRandomByCountry);
  els.allTabBtn.addEventListener("click", () => switchView("all"));
  els.favoritesTabBtn.addEventListener("click", () => switchView("favorites"));
  els.languageSelect.addEventListener("change", async () => {
    state.language = els.languageSelect.value;
    await chrome.storage.local.set({ [STORE.language]: state.language });
    applyLanguage();
    hydrateFilters();
    renderAll();
  });
}

async function loadData() {
  const saved = await chrome.storage.local.get([STORE.customProxies, STORE.customMeta, STORE.favorites, STORE.language]);
  state.proxies = Array.isArray(saved[STORE.customProxies])
    ? saved[STORE.customProxies]
    : (window.PROXYFLOW_DEFAULT_PROXIES || []);
  state.meta = saved[STORE.customMeta] || window.PROXYFLOW_DEFAULT_META || {};
  state.favorites = new Set(saved[STORE.favorites] || []);
  state.language = saved[STORE.language] || detectLanguage();
  els.languageSelect.value = state.language;
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

  els.protocolFilter.innerHTML = `<option value="all">${escapeHtml(t("allProtocols"))}</option>` +
    protocols.map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p.toUpperCase())}</option>`).join("");

  els.countryFilter.innerHTML = `<option value="all">${escapeHtml(t("allCountries"))}</option>` +
    countries.map((c) => {
      const sample = state.proxies.find((p) => p.country === c);
      const code = sample?.countryCode ? ` (${escapeHtml(sample.countryCode)})` : "";
      const viHint = countryAliasLabel(sample?.countryCode, c);
      return `<option value="${escapeHtml(c)}">${escapeHtml(c)}${code}${viHint}</option>`;
    }).join("");

  els.protocolFilter.value = state.protocol;
  els.countryFilter.value = state.country;
}

function renderAll() {
  applyLanguage();
  renderStats();
  renderStatus();
  renderList();
}

function renderStats() {
  const countries = new Set(state.proxies.map((p) => p.countryCode || p.country).filter(Boolean));
  els.totalCount.textContent = state.proxies.length.toLocaleString(localeForLanguage());
  els.countryCount.textContent = countries.size.toLocaleString(localeForLanguage());
  els.fastCount.textContent = state.proxies.filter((p) => Number(p.timeout) <= 1).length.toLocaleString(localeForLanguage());
  els.updatedAt.textContent = state.meta.updatedAt ? formatMessage("updatedAt", { date: formatDate(state.meta.updatedAt) }) : t("offlineData");
}

function renderStatus() {
  const active = state.mode === "fixed" && state.selectedProxy;
  els.statusOrb.classList.toggle("active", Boolean(active));
  els.statusText.textContent = active
    ? formatMessage("activeStatus", {
      protocol: state.selectedProxy.protocol.toUpperCase(),
      host: state.selectedProxy.host,
      port: state.selectedProxy.port
    })
    : t("directStatus");

  els.selectedProxy.innerHTML = active
    ? proxySummary(state.selectedProxy)
    : t("noSelected");
}

function renderList() {
  const q = state.search;
  state.filtered = state.proxies
    .filter((p) => state.view === "all" || state.favorites.has(proxyId(p)))
    .filter((p) => state.protocol === "all" || p.protocol === state.protocol)
    .filter((p) => state.country === "all" || p.country === state.country)
    .filter((p) => !q || searchable(p).includes(q))
    .sort((a, b) => favoriteScore(b) - favoriteScore(a) || Number(a.timeout) - Number(b.timeout))
    .slice(0, 120);

  renderTabs();
  const suffix = state.view === "favorites" ? t("favoriteSuffix") : t("displayedSuffix");
  els.resultCount.textContent = `${state.filtered.length.toLocaleString(localeForLanguage())} ${suffix}`;

  if (!state.filtered.length) {
    const emptyTitle = state.view === "favorites" ? t("emptyFavTitle") : t("emptyTitle");
    const emptyHint = state.view === "favorites" ? t("emptyFavHint") : t("emptyHint");
    els.proxyList.innerHTML = `<article class="proxy-card empty-card"><div class="proxy-main"><strong>${escapeHtml(emptyTitle)}</strong><div class="proxy-meta">${escapeHtml(emptyHint)}</div></div></article>`;
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
        <button class="icon-btn" data-apply="${index}" title="${escapeHtml(t("applyTitle"))}">⚡</button>
        <button class="icon-btn" data-copy="${index}" title="${escapeHtml(t("copyTitle"))}">⧉</button>
        <button class="icon-btn" data-fav="${index}" title="${escapeHtml(t("favoriteTitle"))}">${fav}</button>
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
  toast(t("copied"));
}

async function toggleFavorite(index) {
  const id = proxyId(state.filtered[index]);
  if (state.favorites.has(id)) state.favorites.delete(id);
  else state.favorites.add(id);
  await chrome.storage.local.set({ [STORE.favorites]: [...state.favorites] });
  renderList();
}

function switchView(view) {
  state.view = view;
  renderList();
}

function renderTabs() {
  const favoriteCount = state.favorites.size;
  els.allTabBtn.classList.toggle("active", state.view === "all");
  els.favoritesTabBtn.classList.toggle("active", state.view === "favorites");
  els.allTabBtn.setAttribute("aria-selected", String(state.view === "all"));
  els.favoritesTabBtn.setAttribute("aria-selected", String(state.view === "favorites"));
  els.allTabBtn.textContent = t("all");
  els.favoritesTabBtn.textContent = `★ ${t("favorites")} (${favoriteCount.toLocaleString(localeForLanguage())})`;
}

async function applyRandomByCountry() {
  if (state.country === "all") {
    toast(t("chooseCountry"));
    els.countryFilter.focus();
    return;
  }

  const candidates = state.proxies
    .filter((p) => p.country === state.country)
    .filter((p) => state.protocol === "all" || p.protocol === state.protocol)
    .sort((a, b) => Number(a.timeout) - Number(b.timeout));

  if (!candidates.length) {
    toast(t("noCountryProxy"));
    return;
  }

  const bestPoolSize = Math.min(20, candidates.length);
  const bestPool = candidates.slice(0, bestPoolSize);
  const proxy = bestPool[Math.floor(Math.random() * bestPool.length)];
  await applySelectedProxy(proxy, formatMessage("randomDone", { country: proxy.country || state.country }));
}

async function openIpChecker() {
  await chrome.tabs.create({ url: "https://whatismyipaddress.com/" });
}

async function applySelectedProxy(proxy, successMessage = t("applied")) {
  const res = await sendMessage({ type: "APPLY_PROXY", proxy });
  if (res.ok) {
    state.mode = "fixed";
    state.selectedProxy = proxy;
    renderStatus();
    toast(successMessage);
  } else {
    toast(res.error || t("applyFailed"));
  }
}

async function refreshOnline() {
  els.refreshBtn.disabled = true;
  els.refreshBtn.textContent = t("refreshing");
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
    toast(formatMessage("updateDone", { count: simplified.length.toLocaleString(localeForLanguage()) }));
  } catch (error) {
    toast(formatMessage("updateError", { error: error.message }));
  } finally {
    els.refreshBtn.disabled = false;
    els.refreshBtn.textContent = t("refresh");
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

function applyLanguage() {
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    node.innerHTML = t(key);
  });
  els.searchInput.placeholder = t("searchPlaceholder");
}

function detectLanguage() {
  const lang = (navigator.language || "vi").slice(0, 2).toLowerCase();
  return TRANSLATIONS[lang] ? lang : "en";
}

function t(key) {
  return (TRANSLATIONS[state.language] && TRANSLATIONS[state.language][key]) || TRANSLATIONS.en[key] || key;
}

function formatMessage(key, values = {}) {
  return t(key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}

function localeForLanguage() {
  const locales = { vi: "vi-VN", en: "en-US", zh: "zh-CN", ru: "ru-RU", es: "es-ES", fr: "fr-FR", ja: "ja-JP" };
  return locales[state.language] || "en-US";
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
    return new Intl.DateTimeFormat(localeForLanguage(), { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
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
