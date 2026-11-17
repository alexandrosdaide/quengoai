/* Dữ liệu web Quê ngoại. Giá, combo, quà, ship: chỉ lấy từ file 01. Chính sách: file 02. Công dụng: file 05. */
window.QB = window.QB || {};
QB.SP = [
 {id:"p350",ten:"Rượu cau Quê ngoại 350ml",ngan:"Rượu nếp, hạt cau",gia:150000,chai:"350",anh:"img/bc-chum-350.jpg",
  thuVien:["img/bc-chum-350.jpg","img/sp-350-studio.jpg","img/bc-bonrua-350.jpg","img/bc-doitay-350.jpg","img/sp-350-nguyenlieu.jpg","img/sp-350-que.jpg"],
  nhan:"Sản phẩm chính",thanhPhan:"Rượu nếp, hạt cau",ship:"Phí ship tính theo thực tế khi giao"},
 {id:"p500",ten:"Rượu cau Quê ngoại Plus 500ml",ngan:"Rượu nếp, hạt cau, lá bạc hà, quế",gia:200000,chai:"500",anh:"img/bc-cau-500.jpg",
  thuVien:["img/bc-cau-500.jpg","img/sp-500-studio.jpg","img/bc-chum-500.jpg","img/bc-bonrua-500.jpg","img/bc-quytrinh-500.jpg","img/sp-500-nguyenlieu.jpg","img/sp-500-que.jpg"],
  nhan:"Bản Plus",thanhPhan:"Rượu nếp, hạt cau, lá bạc hà, quế",ship:"Phí ship tính theo thực tế khi giao"},
 {id:"c350-2",ten:"Combo 2 chai Quê ngoại 350ml",gia:300000,le:300000,chai:"350",so:2,qua:0,nen:1},
 {id:"c350-3",ten:"Combo 3 chai Quê ngoại 350ml",gia:420000,le:450000,chai:"350",so:3,qua:1,nen:2},
 {id:"c350-5",ten:"Combo 5 chai Quê ngoại 350ml",gia:700000,le:750000,chai:"350",so:5,qua:2,nen:3},
 {id:"c350-12",ten:"Combo thùng 12 chai Quê ngoại 350ml",gia:1650000,le:1800000,chai:"350",so:12,qua:6,nen:4},
 {id:"c500-2",ten:"Combo 2 chai Quê ngoại Plus 500ml",gia:400000,le:400000,chai:"500",so:2,qua:0,nen:2},
 {id:"c500-3",ten:"Combo 3 chai Quê ngoại Plus 500ml",gia:560000,le:600000,chai:"500",so:3,qua:1,nen:1},
 {id:"c500-5",ten:"Combo 5 chai Quê ngoại Plus 500ml",gia:960000,le:1000000,chai:"500",so:5,qua:2,nen:4},
 {id:"c500-12",ten:"Combo thùng 12 chai Quê ngoại Plus 500ml",gia:2280000,le:2400000,chai:"500",so:12,qua:8,nen:3}
];
QB.SP.forEach(function(p){
  if(p.so){p.ship="Miễn phí ship";p.goc=p.chai==="500"?"p500":"p350";p.anh=p.chai==="500"?"img/bc-cau-doi.jpg":"img/bc-chum-doi.jpg";}
});

/* Bài viết: sinh tự động từ content/articles/*.json lúc build */
QB.BAI = /*BAI*/[];
QB.NB = /*NB*/{};

/* Ô vấn đề */
QB.OVD = [
 {id:"hoi-mieng",ten:"Hôi miệng, hơi thở có mùi",ic:"i-breath",nb:"hơi thở có mùi khó chịu, rõ nhất lúc mới ngủ dậy hoặc khi miệng khô",ht:"Theo kinh nghiệm dân gian, rượu cau giúp khử mùi hôi và tăng tiết nước bọt trong khoang miệng.",sp:["p350","c350-2"],bai:"hoi-mieng-nguyen-nhan-va-cach-cai-thien"},
 {id:"dau-nhuc",ten:"Đau nhức răng",ic:"i-bolt",nb:"đau âm ỉ hoặc nhói ở một vùng răng, tăng khi nhai hoặc ăn đồ nóng, lạnh",ht:"Chấm tăm bông lên vùng đau giúp hỗ trợ làm dịu các cơn đau nhức răng tạm thời.",sp:["p350","c350-3"],bai:"dau-nhuc-rang-cach-lam-diu-tai-nha"},
 {id:"sung-nuou",ten:"Sưng nướu, viêm lợi",ic:"i-gum",nb:"nướu đỏ, sưng, đau khi chải răng hoặc khi ăn",ht:"Ngậm 10–15ml trong 30–45 giây rồi nhổ bỏ, giúp hỗ trợ giảm sưng tấy nướu tạm thời.",sp:["p500","c500-3"],bai:"sung-nuou-viem-loi-nguyen-nhan-cach-cham-soc"},
 {id:"sau-rang",ten:"Sâu răng nhẹ",ic:"i-dot",nb:"đốm trắng đục hoặc nâu nhỏ trên mặt răng, ê nhức nhẹ khi ăn đồ ngọt",ht:"Hỗ trợ làm dịu cơn đau nhức do sâu răng nhẹ tạm thời. Sâu răng cần được nha sĩ kiểm tra.",sp:["p500","c500-2"],bai:"dau-hieu-sau-rang-giai-doan-dau"},
 {id:"hang-ngay",ten:"Chăm sóc mỗi sáng tối",ic:"i-sun",nb:"muốn giữ khoang miệng dễ chịu bằng một thói quen dân gian, sáng ngủ dậy và tối trước khi ngủ",ht:"Hạt cau ngâm rượu nếp giúp ức chế sự phát triển của một số vi khuẩn ở khoang miệng.",sp:["p500","c350-5"],bai:"suc-mieng-nuoc-muoi-am-dung-cach"},
 {id:"lan-dau",ten:"Lần đầu dùng rượu cau",ic:"i-swab",nb:"chưa quen cách chấm hoặc ngậm, lo nuốt phải",ht:"Cách 1: chấm tăm bông sạch lên vùng răng, nướu đau. Cách 2: ngậm 10–15ml trong 30–45 giây rồi nhổ bỏ hoàn toàn. Không nuốt, không uống. Sau khi dùng, chờ khoảng 15 phút mới ăn uống.",sp:["p350","c350-2"],bai:"trau-cau-va-ruou-cau-cua-ba",tienIch:true},
 {id:"ca-nha",ten:"Mua cho cả nhà, làm quà",ic:"i-gift",nb:"muốn mua cho bố mẹ, ông bà hoặc người lớn trong gia đình",ht:"Combo thùng 12 chai được tặng thêm chai 350ml và miễn phí ship. Chỉ dành cho người lớn: không dùng cho trẻ em, phụ nữ có thai.",sp:["c350-12","c500-12"],bai:"trau-cau-va-ruou-cau-cua-ba"},
 {id:"di-kham",ten:"Đau nhiều hoặc kéo dài",ic:"i-alert",nb:"đau dữ dội, sưng má, sốt hoặc đau kéo dài nhiều ngày",ht:"Với tình trạng đau nhiều hoặc kéo dài, bạn nên đi khám nha sĩ để tìm đúng nguyên nhân. Rượu cau Quê ngoại đồng hành hỗ trợ giảm khó chịu tại chỗ.",sp:["p350","p500"],bai:"khi-nao-can-di-kham-nha-si",canhBao:true}
];

/* Hero 5 slide */
QB.SLIDES = [
 {mat:"Hôi miệng",td:"Hơi thở dễ chịu, tự tin trò chuyện",mt:"Theo kinh nghiệm dân gian, rượu cau giúp khử mùi hôi và tăng tiết nước bọt trong khoang miệng.",sp:"p350",nen:"img/hero-1.jpg"},
 {mat:"Đau nhức răng",td:"Hỗ trợ làm dịu cơn đau nhức răng",mt:"Chấm tăm bông lên vùng đau, 2 lần mỗi ngày.",canh:"Đau nhiều hoặc kéo dài, bạn nên đi khám nha sĩ.",sp:"c350-3",nen:"img/hero-2.jpg"},
 {mat:"Sưng nướu, viêm lợi",td:"Hỗ trợ giảm sưng nướu tạm thời",mt:"Ngậm 10–15ml trong 30–45 giây rồi nhổ bỏ hoàn toàn. Bản Plus có thêm lá bạc hà và quế.",sp:"c500-3",nen:"img/hero-3.jpg"},
 {mat:"Sâu răng nhẹ",td:"Sâu răng nhẹ gây đau nhức?",mt:"Rượu cau hỗ trợ làm dịu cơn đau tại chỗ.",canh:"Sản phẩm chăm sóc, không phải thuốc. Bạn vẫn nên khám nha sĩ.",sp:"c500-2",nen:"img/hero-4.jpg"},
 {mat:"Chăm sóc mỗi ngày",td:"Thói quen dân gian mỗi sáng tối",mt:"Hạt cau ngâm rượu nếp giúp ức chế sự phát triển của một số vi khuẩn ở khoang miệng.",sp:"c350-5",nen:"img/hero-5.jpg"}
];

/* Ba hàng theo nhu cầu */
QB.HANG = [
 {td:"Hôi miệng, hơi thở có mùi",mt:"Giúp khử mùi hôi và tăng tiết nước bọt, theo kinh nghiệm dân gian.",ds:["p350","c350-2","c350-3"],anh:{"p350":"img/bc-bonrua-350.jpg"}},
 {td:"Đau nhức răng, sưng nướu",mt:"Hỗ trợ làm dịu đau nhức răng và sưng nướu tạm thời.",ds:["p500","c500-2","c500-3"],anh:{"p500":"img/bc-bonrua-500.jpg"}},
 {td:"Chăm sóc mỗi ngày cho người lớn trong nhà",mt:"Combo nhiều chai, miễn phí ship, có quà tặng.",ds:["c350-5","c500-5","c350-12"],anh:{}}
];

/* Hộp hỗ trợ và chính sách. Nội dung có nguồn: file 01, 02. Mục chưa có nguồn: ghi rõ đang chờ. */
QB.HO_TRO = {
 "dat-hang":{td:"Hướng dẫn đặt hàng",html:"<ol><li>Chọn sản phẩm hoặc combo, bấm <b>Mua ngay</b>.</li><li>Điền họ tên, số điện thoại, địa chỉ nhận hàng và số lượng.</li><li>Bấm <b>Gửi đơn hàng</b>. Quản lý Quê ngoại gọi xác nhận đơn trong khoảng 1 giờ.</li><li>Nhận hàng, kiểm tra hàng rồi thanh toán.</li></ol><p>Bạn cũng có thể gọi hotline <b>0342 756 219</b> để đặt hàng.</p><p>Thời gian giao: nội thành 1–2 ngày, các tỉnh 3–5 ngày.</p>"},
 "thanh-toan":{td:"Thanh toán",html:"<p>Thanh toán khi nhận hàng (COD): đơn vị vận chuyển thu tiền hộ khi giao. <span class='cho'>Chờ xác nhận pháp lý</span></p><p>Bạn được kiểm tra hàng trước khi thanh toán.</p>"},
 "van-chuyen":{td:"Chính sách vận chuyển",html:"<ul><li>Từ combo 2 chai trở lên: <b>miễn phí ship</b>.</li><li>Đơn lẻ 1 chai: phí ship tính theo thực tế khi giao.</li><li>Thời gian giao: nội thành 1–2 ngày, các tỉnh 3–5 ngày.</li><li>Đơn vị vận chuyển: <span class='cho'>Chờ bổ sung</span></li></ul>"},
 "kiem-hang":{td:"Chính sách kiểm hàng",html:"<p>Bạn được kiểm tra hàng, đối chiếu đúng sản phẩm, dung tích và số lượng khi nhận, trước khi thanh toán.</p>"},
 "doi-tra":{td:"Chính sách đổi trả",html:"<p><b>Được đổi trả khi:</b></p><ul><li>Sản phẩm không đúng như hình ảnh trên website.</li><li>Không đúng mẫu mã hoặc dung tích khi đặt hàng.</li><li>Sản phẩm bị lỗi, méo mó, bị vỡ.</li><li>Nước bị biến màu bất thường.</li></ul><p><b>Thời hạn:</b> trong vòng 2 ngày kể từ khi nhận hàng. <b>Phí đổi trả:</b> Quê ngoại chịu.</p><p><b>Cách báo:</b> gửi ảnh, video tình trạng sản phẩm qua hotline 0342 756 219. Nhân viên chăm sóc khách hàng sẽ liên hệ xác nhận rồi tiến hành đổi trả.</p>"},
 "dieu-khoan":{td:"Điều khoản sử dụng",html:"<p><span class='cho'>Đang soạn, chờ chủ shop duyệt</span></p><p>Nếu cần hỗ trợ, vui lòng gọi 0342 756 219.</p>"},
 "bao-mat":{td:"Chính sách bảo mật thông tin",html:"<p>Quê ngoại chỉ dùng họ tên, số điện thoại và địa chỉ bạn cung cấp để liên hệ tư vấn, xác nhận và giao đơn hàng.</p><p><span class='cho'>Bản đầy đủ đang soạn, chờ chủ shop duyệt</span></p>"},
 "khieu-nai":{td:"Quy trình giải quyết khiếu nại",html:"<p>Vui lòng liên hệ hotline 0342 756 219 hoặc email quengoai0@gmail.com. Quản lý Quê ngoại sẽ trực tiếp tiếp nhận và phản hồi.</p><p><span class='cho'>Quy trình chi tiết chờ chủ shop duyệt</span></p>"}
};
QB.HOI_DAP = [
 ["Rượu cau Quê ngoại có uống được không?","Không. Rượu cau chỉ dùng trong khoang miệng: chấm hoặc ngậm rồi nhổ bỏ hoàn toàn, tuyệt đối không nuốt hay uống."],
 ["Rượu cau có phải là thuốc không?","Không. Đây là sản phẩm chăm sóc, hỗ trợ tại chỗ theo kinh nghiệm dân gian. Bạn vẫn nên đi khám nha sĩ định kỳ. Nếu đau nhiều hoặc kéo dài, hãy đi khám nha sĩ để tìm đúng nguyên nhân."],
 ["Hai loại 350ml và Plus 500ml khác nhau thế nào?","Chai 350ml gồm rượu nếp và hạt cau. Chai Plus 500ml có thêm lá bạc hà và quế. Cách dùng hai loại giống nhau."],
 ["Ai không nên dùng?","Trẻ em, phụ nữ có thai, người có bệnh lý hoặc tổn thương nặng về răng miệng."],
 ["Hạn dùng và cách bảo quản?","Hạn dùng 1 năm tính từ ngày nhận hàng. Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp."],
 ["Phí ship và thời gian giao hàng?","Từ combo 2 chai được miễn phí ship. Đơn lẻ 1 chai tính phí ship theo thực tế khi giao. Nội thành 1–2 ngày, các tỉnh 3–5 ngày. Bạn được kiểm tra hàng khi nhận."],
 ["Khi nào được đổi trả?","Trong vòng 2 ngày kể từ khi nhận hàng, nếu sản phẩm không đúng mẫu mã, dung tích, bị lỗi, vỡ hoặc nước biến màu bất thường. Quê ngoại chịu phí đổi trả."]
];
