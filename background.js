const STORAGE_KEYS = {
  mode: "proxyflow.mode",
  selectedProxy: "proxyflow.selectedProxy"
};

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ [STORAGE_KEYS.mode]: "direct" });
  await setBadge("OFF", "#64748b");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message)
    .then(sendResponse)
    .catch((error) => sendResponse({ ok: false, error: error.message || String(error) }));
  return true;
});

async function handleMessage(message) {
  if (!message || !message.type) {
    throw new Error("Invalid message");
  }

  if (message.type === "APPLY_PROXY") {
    return applyProxy(message.proxy);
  }

  if (message.type === "DIRECT_MODE") {
    return directMode();
  }

  if (message.type === "GET_STATE") {
    const data = await chrome.storage.local.get([STORAGE_KEYS.mode, STORAGE_KEYS.selectedProxy]);
    return {
      ok: true,
      mode: data[STORAGE_KEYS.mode] || "direct",
      selectedProxy: data[STORAGE_KEYS.selectedProxy] || null
    };
  }

  throw new Error(`Unsupported message type: ${message.type}`);
}

async function applyProxy(proxy) {
  validateProxy(proxy);

  const scheme = normalizeScheme(proxy.protocol);
  const config = {
    mode: "fixed_servers",
    rules: {
      singleProxy: {
        scheme,
        host: proxy.host,
        port: Number(proxy.port)
      },
      bypassList: ["<local>"]
    }
  };

  await chrome.proxy.settings.set({ value: config, scope: "regular" });
  await chrome.storage.local.set({
    [STORAGE_KEYS.mode]: "fixed",
    [STORAGE_KEYS.selectedProxy]: proxy
  });
  await setBadge(proxy.protocol.toUpperCase().replace("SOCKS", "S"), protocolColor(proxy.protocol));

  return { ok: true, mode: "fixed", selectedProxy: proxy };
}

async function directMode() {
  await chrome.proxy.settings.set({ value: { mode: "direct" }, scope: "regular" });
  await chrome.storage.local.set({ [STORAGE_KEYS.mode]: "direct" });
  await setBadge("OFF", "#64748b");
  return { ok: true, mode: "direct", selectedProxy: null };
}

function validateProxy(proxy) {
  if (!proxy || !proxy.host || !proxy.port || !proxy.protocol) {
    throw new Error("Proxy thiếu protocol/host/port");
  }

  const allowed = new Set(["http", "https", "socks4", "socks5"]);
  if (!allowed.has(String(proxy.protocol).toLowerCase())) {
    throw new Error(`Giao thức không hỗ trợ: ${proxy.protocol}`);
  }
}

function normalizeScheme(protocol) {
  const value = String(protocol).toLowerCase();
  if (value === "socks4") return "socks4";
  if (value === "socks5") return "socks5";
  if (value === "https") return "https";
  return "http";
}

function protocolColor(protocol) {
  const value = String(protocol).toLowerCase();
  if (value === "socks5") return "#8b5cf6";
  if (value === "socks4") return "#06b6d4";
  return "#22c55e";
}

async function setBadge(text, color) {
  await chrome.action.setBadgeText({ text });
  await chrome.action.setBadgeBackgroundColor({ color });
}
