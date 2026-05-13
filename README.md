# ProxyFlow - Smart Proxy Picker

ProxyFlow is a lightweight Chrome extension for quickly selecting public proxies, filtering them by country/protocol, saving favorites, and verifying the current IP address. It is built with Manifest V3 and plain HTML/CSS/JavaScript.

> Public proxies can be unstable or unsafe. Use them only for testing, browsing experiments, and non-sensitive workflows.

## English

### Features

- Embedded offline proxy database generated from [`monosans/proxy-list`](https://github.com/monosans/proxy-list).
- Online update button to refresh the proxy list from GitHub.
- Supported proxy protocols: `http`, `socks4`, and `socks5`.
- Country-friendly search with aliases such as `USA`, `US`, `America`, `Mỹ`, `my`, `Nhật`, `Đức`, etc.
- Filters for country and protocol.
- One-click **Random by country** connection: choose a country and let ProxyFlow pick a fast proxy automatically.
- Favorites tab for saved proxies.
- Current connection card with ON/OFF status.
- One-click **Check IP** via [WhatIsMyIPAddress](https://whatismyipaddress.com/).
- Quick copy in `protocol://host:port` format.
- Premium dark UI optimized for a Chrome extension popup.

### Install in Chrome

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the project folder that contains `manifest.json`.
5. Pin ProxyFlow to the Chrome toolbar for easier access.

### Recommended usage flow

1. Select a country.
2. Click **Random by country**.
3. Click **Check IP** to confirm the new IP/location.
4. Save working proxies with the star button.
5. Use **Turn off proxy** when you want to return to direct mode.

### Update offline proxy data

Run the update script from the project folder:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\update-proxies.ps1
```

The script downloads the latest `proxies.json` and regenerates `proxy-data.js`.

---

## Tiếng Việt

ProxyFlow là Chrome extension gọn nhẹ giúp chọn proxy công khai nhanh hơn, dễ lọc theo quốc gia/giao thức, lưu proxy yêu thích và kiểm tra IP hiện tại.

### Tính năng

- Có sẵn danh sách proxy offline từ [`monosans/proxy-list`](https://github.com/monosans/proxy-list).
- Nút **Cập nhật** để tải danh sách proxy mới nhất từ GitHub.
- Hỗ trợ `http`, `socks4`, `socks5`.
- Tìm quốc gia thân thiện với người Việt: gõ `Mỹ`, `my`, `USA`, `Nhật`, `Đức`, `Hàn Quốc`, `Trung Quốc`...
- Lọc theo quốc gia và giao thức.
- Nút **Random theo quốc gia**: chỉ cần chọn quốc gia, extension tự chọn proxy nhanh phù hợp.
- Tab **Yêu thích** để quản lý proxy đã lưu.
- Hiển thị trạng thái kết nối hiện tại rõ ràng.
- Nút **Check IP** mở WhatIsMyIPAddress để kiểm tra IP/vị trí.
- Copy nhanh proxy theo dạng `protocol://host:port`.
- Giao diện dark premium, tối ưu cho popup extension.

### Cài vào Chrome

1. Mở Chrome và truy cập `chrome://extensions`.
2. Bật **Developer mode**.
3. Chọn **Load unpacked**.
4. Chọn thư mục dự án có file `manifest.json`.
5. Ghim ProxyFlow lên thanh công cụ Chrome để dùng nhanh.

### Cách dùng đề xuất

1. Chọn quốc gia cần kết nối.
2. Bấm **Random theo quốc gia**.
3. Bấm **Check IP** để xác nhận IP/vị trí mới.
4. Nếu proxy dùng tốt, bấm sao để lưu vào **Yêu thích**.
5. Khi không cần proxy, bấm **Tắt Proxy** để quay về mạng trực tiếp.

### Cập nhật dữ liệu proxy offline

Chạy lệnh sau trong thư mục dự án:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\update-proxies.ps1
```

Script sẽ tải `proxies.json` mới nhất và tạo lại `proxy-data.js`.

---

## 多语言简介 / Multi-language overview

### 中文

ProxyFlow 是一个轻量级 Chrome 代理扩展。它可以按国家和协议筛选公共代理，支持收藏代理、随机选择指定国家的代理，并通过 WhatIsMyIPAddress 检查当前 IP。

### Русский

ProxyFlow — это легкое расширение Chrome для выбора публичных прокси. Оно поддерживает фильтрацию по стране и протоколу, избранные прокси, случайное подключение по выбранной стране и проверку текущего IP через WhatIsMyIPAddress.

### Español

ProxyFlow es una extensión ligera de Chrome para seleccionar proxies públicos. Permite filtrar por país/protocolo, guardar favoritos, conectarse aleatoriamente por país y comprobar la IP actual con WhatIsMyIPAddress.

### Français

ProxyFlow est une extension Chrome légère pour sélectionner des proxys publics. Elle permet de filtrer par pays/protocole, d'enregistrer des favoris, de choisir un proxy aléatoire par pays et de vérifier l'adresse IP actuelle avec WhatIsMyIPAddress.

### 日本語

ProxyFlow は、公開プロキシをすばやく選択するための軽量 Chrome 拡張機能です。国やプロトコルでの絞り込み、お気に入り保存、国別ランダム接続、WhatIsMyIPAddress による IP 確認に対応しています。

---

## Security notes

Public proxies may be slow, unavailable, monitored, or changed at any time. Do not use public proxies for banking, passwords, private accounts, confidential data, or any workflow that requires strong security.

## Credits

- Proxy data source: [`monosans/proxy-list`](https://github.com/monosans/proxy-list)
- IP check website: [WhatIsMyIPAddress](https://whatismyipaddress.com/)
