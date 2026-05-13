# ProxyFlow - Smart Proxy Picker

ProxyFlow là Chrome extension gọn nhẹ để chọn proxy công khai từ [`monosans/proxy-list`](https://github.com/monosans/proxy-list). Extension được viết clean-room bằng Manifest V3, HTML/CSS/JS thuần.

## Tính năng

- Danh sách proxy offline nhúng sẵn từ `monosans/proxy-list`.
- Nút **Cập nhật online** để tải danh sách mới nhất từ GitHub.
- Giữ đầy đủ giao thức có trong nguồn: `http`, `socks4`, `socks5`.
- Tìm kiếm theo host, quốc gia, thành phố, ASN.
- Lọc theo giao thức và quốc gia.
- Sắp xếp ưu tiên proxy yêu thích và timeout thấp.
- Nút **Tắt Proxy** để quay về Direct Mode.
- Copy nhanh `protocol://host:port`.

## Cài vào Chrome

1. Mở Chrome và vào `chrome://extensions`.
2. Bật **Developer mode**.
3. Chọn **Load unpacked**.
4. Chọn thư mục:

```text
d:\DuAn\28.Extension\proxy
```

## Cập nhật proxy offline trước khi đóng gói

Chạy PowerShell trong thư mục extension:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\update-proxies.ps1
```

Script sẽ tải `proxies.json` mới nhất và tạo lại `proxy-data.js`.

## Lưu ý an toàn

Proxy công khai có thể chậm, chết, bị theo dõi hoặc thay đổi bất kỳ lúc nào. Không nên dùng proxy công khai cho tài khoản quan trọng, ngân hàng, mật khẩu, dữ liệu riêng tư hoặc tác vụ cần bảo mật cao.
