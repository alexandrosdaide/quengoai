# 11 – Vận hành web Quê ngoại

## 1. Trạng thái (17/11/2026)
- Chủ shop bỏ phương án tên miền riêng, chọn chạy miễn phí trên Cloudflare Pages: **https://quengoai.pages.dev** (web đầy đủ + cẩm nang) và **https://quengoai.pages.dev/lp/** (landing page 1 trang kiểu LadiPage để chạy quảng cáo).
- Bản chính thức: Google được đọc, có sitemap.xml, robots.txt, canonical, og:url.
- Landing page: đặt hàng bằng phiếu → tạo sẵn nội dung đơn → khách gửi qua Zalo, Messenger (điền sẵn), SMS (điền sẵn) hoặc gọi. Chưa có nơi lưu đơn tự động (Google Sheets).
- QR trỏ về https://quengoai.pages.dev/lp/ (đã quét thử).
- Nếu tên dự án `quengoai` trên Cloudflare bị trùng: đổi SITE trong build.py (QB_SITE) và làm lại QR.

## 2. Đưa lên (làm 1 lần, làm được trên iPad)
1. Cloudflare › Workers & Pages › Create › Pages › Upload assets › tên dự án `quengoai` › tải `que-ngoai-web.zip` › Deploy.
2. Google Search Console: thêm https://quengoai.pages.dev/ (xác minh bằng thẻ HTML) › gửi sitemap.xml.
3. Lần cập nhật sau: dự án `quengoai` › Create deployment › tải zip mới.

## 3. Đăng bài hằng ngày
- Mỗi bài = 1 file JSON trong `content/articles/` theo mẫu `v2/mau/mau-bai-viet.json`, kèm 1 ảnh 1200×675 (đặt tên ở `anh_file`, để trong `work/web/`).
- Trường `ngay` (YYYY-MM-DD) quyết định thứ tự: bài mới tự lên đầu danh sách, tự vào sitemap. Không cần sửa build.py.
- Dựng: `python3 v2/build.py` (bản chính thức). Bản nháp chặn Google: `QB_NHAP=1 python3 v2/build.py`.
- Kiểm tra trước khi đăng: công dụng chỉ theo file 05, không từ cấm, không nêu độ cồn, ảnh đúng chủ đề, có liên kết nội bộ, chạy `node v2/test.js`.
- Nhịp khuyến nghị: 2–3 bài chất lượng/tuần tốt hơn 7 bài mỏng (Google phạt nội dung tạo hàng loạt, nhất là chủ đề sức khoẻ).

## 4. Nâng cấp nên làm (khi có máy tính)
- Đưa mã nguồn lên GitHub và nối Cloudflare Pages với GitHub: đăng bài = thêm 1 file, web tự cập nhật trong khoảng 1 phút, có lịch sử và quay lại bản cũ.

## 5. Pháp lý trước khi chạy chính thức
- Web bán hàng phải công bố tên chủ sở hữu, địa chỉ, mã số thuế/số đăng ký kinh doanh (Nghị định 52/2013, sửa bởi Nghị định 85/2021) và thông báo website TMĐT bán hàng trên online.gov.vn. Hiện web đã bỏ dòng mã số thuế theo yêu cầu chủ shop: cần bổ sung lại khi chạy thật.
