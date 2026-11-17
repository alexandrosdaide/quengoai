/* Quê ngoại: phần dùng chung cho mọi trang (header, giỏ hàng, đặt nhanh, xem nhanh, hộp hỗ trợ, trợ lý) */
(function(){
"use strict";
var QB=window.QB, A=QB.A||"", BV=QB.BV||"";
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var vnd=function(n){return n.toLocaleString("vi-VN")+"đ"};
var luu={get:function(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
function im(p){return A+p}
function ic(id,st){return '<svg class="icon"'+(st?' style="'+st+'"':'')+'><use href="#'+id+'"/></svg>'}
function boDau(s){return s.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D").toLowerCase()}
function toast(t){var el=$("#toast");el.textContent=t;el.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(function(){el.hidden=true},3000)}
var SP={};QB.SP.forEach(function(p){SP[p.id]=p});
var BAI={};QB.BAI.forEach(function(b){BAI[b.slug]=b});
function urlBai(slug){return BV+slug+".html"}
function quaChu(p){return p.qua?("Tặng "+p.qua+" chai 350ml"):""}
function dongCung(p){return QB.SP.filter(function(x){return x.chai===p.chai})}
QB.u={$:$,$$:$$,vnd:vnd,im:im,ic:ic,toast:toast,SP:SP,BAI:BAI,urlBai:urlBai,quaChu:quaChu,boDau:boDau,luu:luu};

/* ===== Thẻ sản phẩm (dùng ở trang chủ và trang bài) ===== */
function anhCombo(p){
  var toiDa=p.chai==="500"?3:4,n=Math.min(p.so,toiDa),h="",i;
  for(i=0;i<n;i++)h+='<img src="'+im("img/chai-"+p.chai+".webp")+'" alt="" loading="lazy">';
  if(p.so>n)h+='<span class="x">×'+p.so+'</span>';
  if(p.qua)h+='<img class="nho" src="'+im("img/chai-350.webp")+'" alt="" loading="lazy">'+(p.qua>1?'<span class="x qua">+'+p.qua+'</span>':'');
  return '<div class="anh-combo" role="img" aria-label="'+p.ten+'" style="background-image:url('+im("img/nen-combo-"+p.nen+".jpg")+')">'+
   '<div class="combo-dau"><b>'+(p.so===12?"THÙNG 12 CHAI":"COMBO "+p.so+" CHAI")+'</b><span>'+(p.chai==="500"?"Quê ngoại Plus 500ml":"Quê ngoại 350ml")+(p.qua?" · "+quaChu(p):"")+'</span></div>'+
   (p.qua?'<span class="sticker-qua">Tặng<b>+'+p.qua+'</b>chai</span>':'')+'<div class="chai-hang">'+h+'</div>'+
   '<div class="combo-chan"><span class="tag ship">'+ic("i-truck")+'FREESHIP</span><span class="gia-to">'+vnd(p.gia)+(p.le>p.gia?'<s>'+vnd(p.le)+'</s>':'')+'</span><span class="tag phai">Kiểm hàng<br>khi nhận</span></div></div>';
}
QB.theSp=function(p,anhRieng){
  var anh=p.so?anhCombo(p):'<img src="'+im(anhRieng||p.anh)+'" alt="'+p.ten+'" loading="lazy">';
  var nh=p.so?'<span class="ruy-bang">'+ic("i-truck")+'Miễn phí ship</span>':'<div class="nhan-goc"><span>'+p.nhan+'</span></div>';
  return '<article class="the-sp" id="sp-'+p.id+'"><div class="anh-sp" data-xem="'+p.id+'">'+anh+nh+'</div>'+
   '<div class="noi-sp"><h3 data-xem="'+p.id+'">'+p.ten.replace("Quê ngoại",'<span class="nobr">Quê ngoại</span>')+(p.ngan?" – "+p.ngan:"")+'</h3><div class="dong-gia">'+(p.le>p.gia?'<span class="gia-goc" title="Giá mua lẻ '+p.so+' chai">'+vnd(p.le)+'</span>':'')+'<span class="gia-ban">'+vnd(p.gia)+'</span></div>'+
   (p.so?'<span class="phu">'+(p.qua?'<b class="qua-chu">'+ic("i-gift")+quaChu(p)+'</b> · ':'')+'≈ '+vnd(Math.round(p.gia/p.so/1000)*1000)+'/chai</span>':'<span class="phu goi-y-ship">'+ic("i-truck")+'Mua từ 2 chai: miễn phí ship</span>')+
   '<div class="hang-2nut"><button class="nut-them" data-mua="'+p.id+'">Mua ngay</button><button class="nut-gio-nho" data-them="'+p.id+'" aria-label="Thêm '+p.ten+' vào giỏ">'+ic("i-cart")+'</button></div></div></article>';
};
QB.theBai=function(b){
  return '<a class="the-bai" href="'+urlBai(b.slug)+'"><div class="anh"><img src="'+im(b.anh)+'" alt="" loading="lazy"></div><div><span class="nhom">'+(b.nhom==="cam-nang"?"Cẩm nang dân gian":"Sức khỏe răng miệng")+'</span><h3>'+b.tieu_de+'</h3><div class="meta"><span>'+ic("i-clock")+b.thoi_gian_doc+' phút đọc</span></div><p>'+b.tom_tat+'</p></div></a>';
};

/* ===== Lớp bật lên dùng chung ===== */
var lop=$("#lop"),tam=$("#tam"),truocDo=null;
function mo(tieuDe,than,rong){
  truocDo=document.activeElement;dongMega();dongGio();$("#chat").hidden=true;
  tam.className="tam"+(rong?" rong":"");
  tam.innerHTML='<div class="tam-dau"><h2 id="tam-td">'+tieuDe+'</h2><button class="dong-dau" data-dong aria-label="Đóng">'+ic("i-close")+'</button></div><div class="tam-than">'+than+'</div>';
  lop.hidden=false;document.body.classList.add("khoa");tam.scrollTop=0;
  setTimeout(function(){var f=$("[data-dong]",tam);if(f)f.focus()},30);
  return $(".tam-than",tam);
}
function dong(){lop.hidden=true;document.body.classList.remove("khoa");tam.innerHTML="";if(truocDo&&truocDo.focus)truocDo.focus()}
lop.addEventListener("click",function(e){if(e.target===lop||e.target.closest("[data-dong]"))dong()});
QB.mo=mo;QB.dong=dong;

/* ===== Xem nhanh sản phẩm ===== */
function xemNhanh(id){
  var p=SP[id];if(!p)return;var goc=SP[p.goc||p.id],chon=p.id,sl=1;
  var anhs=[p.anh].concat(goc.thuVien.filter(function(a){return a!==p.anh}));
  var el=mo(goc.ten,'<div class="xn"><div class="xn-anh"><div class="xn-chinh"><img id="xn-img" src="'+im(anhs[0])+'" alt="'+p.ten+'"></div><div class="xn-nho">'+anhs.map(function(a,i){return '<button data-anh="'+a+'"'+(i?'':' aria-current="true"')+' aria-label="Ảnh '+(i+1)+'"><img src="'+im(a)+'" alt="" loading="lazy"></button>'}).join("")+'</div></div>'+
   '<div class="xn-tt"><span class="nhan xanh">'+goc.nhan+'</span><div class="xn-gia" id="xn-gia"></div><p class="nhan-nho">Thành phần: '+goc.thanhPhan+'</p>'+
   '<div><b style="font-size:14px;color:var(--reu-900)">Chọn gói</b><div class="chon-goi" id="xn-goi" style="margin-top:8px">'+dongCung(p).map(function(x){return '<button data-goi="'+x.id+'" aria-pressed="'+(x.id===chon)+'"><b>'+(x.so?(x.so===12?"Thùng 12 chai":"Combo "+x.so+" chai"):"1 chai")+'</b><span>'+vnd(x.gia)+'</span><small>'+(x.so?("Miễn phí ship"+(x.qua?" · "+quaChu(x):"")):"Ship theo thực tế")+'</small></button>'}).join("")+'</div></div>'+
   '<div class="hang-mua"><div class="dem-sl"><button data-sl="-1" aria-label="Bớt">−</button><output id="xn-sl">1</output><button data-sl="1" aria-label="Thêm">+</button></div><span class="nhan-nho" id="xn-tong"></span></div>'+
   '<div class="hang-mua"><button class="nut-vang" id="xn-mua">Mua ngay</button><button class="nut-chinh" id="xn-gio">'+ic("i-cart")+'Thêm vào giỏ</button></div>'+
   '<p class="canh-bao-nho">'+ic("i-alert")+'<span>Chỉ dùng trong khoang miệng, nhổ bỏ hoàn toàn sau khi dùng. Tuyệt đối không nuốt hay uống.</span></p>'+
   '<details open><summary>Công dụng</summary><div><p>Theo kinh nghiệm dân gian và y học cổ truyền, hạt cau ngâm rượu:</p><ul><li>Giúp ức chế sự phát triển của một số vi khuẩn ở khoang miệng.</li><li>Hỗ trợ làm dịu các cơn đau nhức răng, sâu răng nhẹ hoặc sưng nướu tạm thời.</li><li>Giúp khử mùi hôi và tăng tiết nước bọt trong khoang miệng.</li></ul><p>Sản phẩm chăm sóc, không phải thuốc. Đau nhiều hoặc kéo dài, bạn nên đi khám nha sĩ.</p></div></details>'+
   '<details><summary>Cách dùng</summary><div><p><b>Chấm:</b> tăm bông sạch thấm ít rượu cau, bôi nhẹ lên vùng răng hoặc nướu đau.</p><p><b>Ngậm hoặc súc:</b> 10–15ml trong 30–45 giây, sau đó nhổ bỏ hoàn toàn.</p><p>2 lần mỗi ngày: sáng khi ngủ dậy, tối trước khi đi ngủ. Sau khi dùng, chờ khoảng 15 phút mới ăn uống hoặc súc lại bằng nước.</p></div></details>'+
   '<details><summary>Không nên dùng</summary><div><p>Trẻ em, phụ nữ có thai, người có bệnh lý hoặc tổn thương nặng về răng miệng.</p></div></details>'+
   '<details><summary>Hạn dùng, bảo quản, xuất xứ</summary><div><p>Hạn dùng 1 năm tính từ ngày nhận hàng. Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.</p><p>Ngâm tại Nam Định theo công thức dân gian.</p></div></details>'+
   '<details><summary>Giao hàng và đổi trả</summary><div><p>Nội thành 1–2 ngày, các tỉnh 3–5 ngày. Kiểm tra hàng khi nhận. Đổi trả trong 2 ngày nếu sai mẫu, sai dung tích, lỗi, vỡ hoặc biến màu bất thường; Quê ngoại chịu phí.</p></div></details>'+
   '</div></div>',true);
  function ve(){var x=SP[chon];$("#xn-gia",el).innerHTML='<span class="gia-ban">'+vnd(x.gia)+'</span>'+(x.le>x.gia?'<span class="gia-goc" title="Giá mua lẻ">'+vnd(x.le)+'</span>':'')+(x.qua?'<span class="nhan">'+quaChu(x)+'</span>':'');
    $("#xn-sl",el).textContent=sl;$("#xn-tong",el).textContent="Tạm tính "+vnd(x.gia*sl);}
  ve();
  el.addEventListener("click",function(e){
    var t=e.target.closest("[data-anh],[data-goi],[data-sl],#xn-mua,#xn-gio");if(!t)return;
    if(t.dataset.anh){$("#xn-img",el).src=im(t.dataset.anh);$$(".xn-nho button",el).forEach(function(b){b.setAttribute("aria-current",b===t)});return}
    if(t.dataset.goi){chon=t.dataset.goi;$$("#xn-goi button",el).forEach(function(b){b.setAttribute("aria-pressed",b===t)});ve();return}
    if(t.dataset.sl){sl=Math.max(1,Math.min(20,sl+(+t.dataset.sl)));ve();return}
    if(t.id==="xn-mua"){datNhanh([{id:chon,sl:sl}]);return}
    if(t.id==="xn-gio"){themGio(chon,sl);dong();moGio();}
  });
}
QB.xemNhanh=xemNhanh;

/* ===== Đặt nhanh 1 bước: chỉ thu các trường trong file 02 ===== */
function datNhanh(ds,tuGio){
  ds=ds.map(function(x){return {id:x.id,sl:x.sl||1}});
  var don=ds.length===1;
  var el=mo("Đặt hàng nhanh",'<div id="dn-sp"></div><div class="dn-tong" id="dn-tong"></div>'+
   '<form id="form-dn" class="dn-ds" novalidate>'+
   '<label class="truong" for="dn-ten">Họ và tên<input id="dn-ten" autocomplete="name" required></label>'+
   '<label class="truong" for="dn-sdt">Số điện thoại<input id="dn-sdt" type="tel" inputmode="tel" autocomplete="tel" required></label>'+
   '<label class="truong" for="dn-dc">Địa chỉ nhận hàng<input id="dn-dc" autocomplete="street-address" placeholder="Số nhà, đường, xã/phường, tỉnh/thành" required></label>'+
   '<p class="ghi" style="font-size:13px;background:var(--dong-nhat);border-radius:8px;padding:10px 12px;color:var(--reu-800)">Quản lý Quê ngoại sẽ gọi xác nhận đơn trong khoảng 1 giờ. Thanh toán khi nhận hàng <span class="cho">Chờ xác nhận pháp lý</span>. Bạn được kiểm tra hàng khi nhận.</p>'+
   '<p class="loi" id="dn-loi" aria-live="polite"></p><button class="nut-vang" type="submit" style="min-height:48px">Gửi đơn hàng</button></form>');
  function ve(){
    var tong=0,coCombo=false,coLe2=false;
    $("#dn-sp",el).innerHTML=ds.map(function(x,i){var p=SP[x.id];tong+=p.gia*x.sl;if(p.so)coCombo=true;if(!p.so&&x.sl>=2)coLe2=true;
      return '<div class="dn-sp"><img src="'+im(p.so?p.anh:p.anh)+'" alt=""><div><b style="color:var(--reu-900)">'+p.ten+'</b><div><span class="gia-ban">'+vnd(p.gia)+'</span>'+(p.qua?' <span class="nhan">'+quaChu(p)+'</span>':'')+'</div>'+
      (don?'<div class="chon-goi" style="margin-top:8px">'+dongCung(p).map(function(y){return '<button type="button" data-goi="'+y.id+'" aria-pressed="'+(y.id===x.id)+'"><b>'+(y.so?(y.so===12?"Thùng 12":"Combo "+y.so):"1 chai")+'</b><span>'+vnd(y.gia)+'</span></button>'}).join("")+'</div>':'')+
      '<div class="dem-sl" style="margin-top:8px"><button type="button" data-sl="-1" data-i="'+i+'" aria-label="Bớt">−</button><output>'+x.sl+'</output><button type="button" data-sl="1" data-i="'+i+'" aria-label="Thêm">+</button></div></div></div>'}).join("");
    $("#dn-tong",el).innerHTML='<div class="hang"><span>Tạm tính</span><b>'+vnd(tong)+'</b></div><div class="hang"><span>Phí ship</span><span>'+(coCombo?"Miễn phí":"Tính theo thực tế khi giao")+'</span></div>'+(coLe2&&!coCombo?'<div class="hang" style="color:var(--cau)"><span>Mẹo: chọn “Combo 2 chai” cùng giá để được miễn phí ship.</span></div>':'')+'<div class="hang lon"><span>Tổng tiền hàng</span><b>'+vnd(tong)+'</b></div>';
  }
  ve();
  el.addEventListener("click",function(e){
    var t=e.target.closest("[data-goi],[data-sl]");if(!t)return;
    if(t.dataset.goi){ds[0].id=t.dataset.goi;ve();return}
    var i=+t.dataset.i;ds[i].sl=Math.max(1,Math.min(20,ds[i].sl+(+t.dataset.sl)));ve();
  });
  $("#form-dn",el).addEventListener("submit",function(e){
    e.preventDefault();var loi="";
    if(!$("#dn-ten",el).value.trim())loi="Vui lòng nhập họ và tên.";else if(!kiemSdt($("#dn-sdt",el).value))loi="Số điện thoại chưa đúng, ví dụ 0912 345 678.";else if($("#dn-dc",el).value.trim().length<8)loi="Vui lòng nhập địa chỉ nhận hàng đầy đủ.";
    $("#dn-loi",el).textContent=loi;if(loi)return;
    var tong=ds.reduce(function(s,x){return s+SP[x.id].gia*x.sl},0);
    if(tuGio){gio={};capNhatGio();}
    $(".tam-than",tam).innerHTML='<div class="thanh-cong"><div class="vong">'+ic("i-check")+'</div><h3 style="font-size:22px">Quê ngoại đã nhận thông tin đơn</h3><p>Quản lý sẽ gọi số <b>'+$("#dn-sdt",el).value+'</b> để xác nhận trong khoảng 1 giờ.</p><div class="dn-tong" style="width:100%;text-align:left">'+ds.map(function(x){return '<div class="hang"><span>'+SP[x.id].ten+' × '+x.sl+'</span><b>'+vnd(SP[x.id].gia*x.sl)+'</b></div>'}).join("")+'<div class="hang lon"><span>Tổng tiền hàng</span><b>'+vnd(tong)+'</b></div></div><p class="ghi-thu">Bản thử: đơn chưa được gửi đi vì web chưa nối nơi nhận đơn.</p><button class="nut-chinh" data-dong>Đóng</button></div>';
  });
}
function kiemSdt(v){return /^(0|\+84)\d{9}$/.test(v.replace(/[\s.\-]/g,""))}
QB.datNhanh=datNhanh;QB.kiemSdt=kiemSdt;

/* ===== Giỏ hàng ===== */
var gio=luu.get("qb-gio")||{};
function capNhatGio(){
  luu.set("qb-gio",gio);
  var dem=Object.keys(gio).reduce(function(s,k){return s+(SP[k]?gio[k]:0)},0);
  $$("[data-dem-gio]").forEach(function(el){el.textContent=dem});
  var ids=Object.keys(gio).filter(function(k){return gio[k]>0&&SP[k]});
  if(!ids.length){$("#ds-gio").innerHTML='<p class="trong">Giỏ hàng đang trống.</p>';$("#tong-gio").innerHTML='<button class="nut-vang" data-mo="tat-ca-sp">Xem sản phẩm</button>';return}
  var tong=0,coCombo=false;
  $("#ds-gio").innerHTML=ids.map(function(k){var p=SP[k];tong+=p.gia*gio[k];if(p.so)coCombo=true;
    return '<div class="mon"><button class="xoa-mon" data-xoa="'+k+'" aria-label="Bỏ '+p.ten+' khỏi giỏ">'+ic("i-close")+'</button><img src="'+im(p.anh)+'" alt=""><div><div class="ten">'+p.ten+'</div><span class="gia-ban">'+vnd(p.gia)+'</span>'+(p.qua?'<div style="font-size:12px;color:var(--mo)">'+quaChu(p)+'</div>':'')+'</div><div class="sl"><button data-gsl="-1" data-id="'+k+'" aria-label="Bớt">−</button><span>'+gio[k]+'</span><button data-gsl="1" data-id="'+k+'" aria-label="Thêm">+</button></div></div>'}).join("");
  $("#tong-gio").innerHTML='<div class="hang"><span>Tạm tính</span><b>'+vnd(tong)+'</b></div><div class="hang"><span>Phí ship</span><span>'+(coCombo?"Miễn phí":"Tính theo thực tế khi giao")+'</span></div><button class="nut-vang" id="gio-dat" style="min-height:48px">Đặt hàng</button>';
}
function themGio(id,sl){gio[id]=(gio[id]||0)+(sl||1);capNhatGio();toast("Đã thêm "+SP[id].ten+" vào giỏ")}
function moGio(){capNhatGio();dongMega();$("#gio").hidden=false;$("#man-gio").hidden=false;document.body.classList.add("khoa")}
function dongGio(){$("#gio").hidden=true;$("#man-gio").hidden=true;if(lop.hidden)document.body.classList.remove("khoa")}
$("#gio-dong").onclick=dongGio;$("#man-gio").onclick=dongGio;
$("#gio").addEventListener("click",function(e){
  var x=e.target.closest("[data-xoa]");if(x){delete gio[x.dataset.xoa];capNhatGio();toast("Đã bỏ khỏi giỏ hàng");return}
  var b=e.target.closest("[data-gsl]");
  if(b){var k=b.dataset.id;gio[k]=Math.max(0,(gio[k]||0)+(+b.dataset.gsl));if(!gio[k])delete gio[k];capNhatGio();return}
  if(e.target.closest("#gio-dat")){var ds=Object.keys(gio).filter(function(k){return SP[k]}).map(function(k){return {id:k,sl:gio[k]}});dongGio();datNhanh(ds,true)}
});
capNhatGio();
QB.themGio=themGio;

/* ===== Mega menu / ngăn danh mục ===== */
var mega=$("#mega"),man=$("#mega-man");
function dongMega(){if(!mega)return;mega.hidden=true;man.hidden=true;document.body.classList.remove("mo-dm");$$("[data-mo='danh-muc']").forEach(function(b){b.setAttribute("aria-expanded","false")})}
function moMega(){$("#chat").hidden=true;dongGio();var m=mega.hidden;mega.hidden=!m;man.hidden=!m;document.body.classList.toggle("mo-dm",m);$$("[data-mo='danh-muc']").forEach(function(b){b.setAttribute("aria-expanded",m)})}
man.onclick=dongMega;

/* ===== Nội dung các hộp ===== */
function veTienIch(el){
  el.innerHTML='<div class="tien-ich-luoi"><div class="ti"><h3>'+ic("i-tool")+'Bạn cần bao nhiêu chai?</h3><p>Ước tính theo cách ngậm 10–15ml, 2 lần mỗi ngày.</p>'+
   '<label>Số người lớn dùng<select data-ti="nguoi"><option>1</option><option>2</option><option>3</option><option>4</option></select></label>'+
   '<label>Thời gian dùng<select data-ti="ngay"><option value="15">Nửa tháng</option><option value="30" selected>1 tháng</option><option value="60">2 tháng</option><option value="90">3 tháng</option></select></label><div class="kq" data-ti="kq" aria-live="polite"></div></div>'+
   '<div class="ti"><h3>'+ic("i-timer")+'Đồng hồ ngậm</h3><p>Ngậm hoặc súc 30–45 giây rồi nhổ bỏ hoàn toàn.</p><div class="dong-ho" data-ti="so" aria-live="polite">0:45</div><div class="thanh-tg"><i data-ti="thanh"></i></div><div class="hang-nut"><button class="nut-chinh" data-dh="45">Bắt đầu 45 giây</button><button class="nut-phu" data-dh="30">30 giây</button></div></div>'+
   '<div class="ti"><h3>'+ic("i-cal")+'Lịch dùng mỗi ngày</h3><div class="lich"><div><b>Sáng</b>Khi ngủ dậy: chấm hoặc ngậm, nhổ bỏ</div><div><b>Sau đó</b>Chờ khoảng 15 phút mới ăn uống hoặc súc lại bằng nước</div><div><b>Tối</b>Trước khi đi ngủ: chấm hoặc ngậm, nhổ bỏ</div></div><p>Không dùng cho trẻ em, phụ nữ có thai, người có bệnh lý hoặc tổn thương nặng về răng miệng.</p></div></div>';
  var g=function(k){return $('[data-ti="'+k+'"]',el)};
  function tinh(){var n=+g("nguoi").value,d=+g("ngay").value,mn=n*d*20,mx=n*d*30;
    var a=Math.ceil(mn/350),b=Math.ceil(mx/350),c=Math.ceil(mn/500),e=Math.ceil(mx/500);
    g("kq").innerHTML="Cần khoảng <b>"+(mn/1000).toLocaleString("vi-VN")+"–"+(mx/1000).toLocaleString("vi-VN")+" lít</b>, tương đương <b>"+a+(b>a?"–"+b:"")+" chai 350ml</b> hoặc <b>"+c+(e>c?"–"+e:"")+" chai Plus 500ml</b>.";}
  g("nguoi").onchange=tinh;g("ngay").onchange=tinh;tinh();
  var t=null;
  el.addEventListener("click",function(ev){var b=ev.target.closest("[data-dh]");if(!b)return;clearInterval(t);var tg=+b.dataset.dh,con=tg;
    function v(){g("so").textContent="0:"+String(con).padStart(2,"0");g("thanh").style.width=((tg-con)/tg*100)+"%"}
    v();t=setInterval(function(){con--;v();if(con<=0){clearInterval(t);g("so").textContent="Nhổ bỏ";toast("Đã đủ thời gian. Nhổ bỏ hoàn toàn, không nuốt.")}},1000);});
}
function veHoiDap(el){el.innerHTML=QB.HOI_DAP.map(function(q,i){return '<details'+(i?'':' open')+'><summary>'+q[0]+'</summary><p>'+q[1]+'</p></details>'}).join("");el.classList.add("hoi-dap")}
QB.veTienIch=veTienIch;QB.veHoiDap=veHoiDap;

var HOP={
 "cach-dung":function(){mo("Cách dùng đúng",'<figure class="hd-anh"><img src="'+im("img/huong-dan-dung.webp?v=2")+'" width="1260" height="4032" alt="Hướng dẫn dùng rượu cau: chấm bằng tăm bông hoặc ngậm 10–15ml trong 30–45 giây, nhổ bỏ hoàn toàn, không nuốt; chờ khoảng 15 phút mới ăn uống; dùng 2 lần mỗi ngày sáng và tối; không dùng cho trẻ em, phụ nữ có thai, người có bệnh lý hoặc tổn thương nặng về răng miệng"></figure>'+
   '<details class="hd-chu"><summary>Xem hướng dẫn dạng chữ</summary><ol><li><b>Cách 1, chấm:</b> tăm bông sạch thấm một lượng nhỏ, bôi nhẹ lên vùng răng hoặc nướu đau.</li><li><b>Cách 2, ngậm, súc:</b> ngậm 10–15ml trong 30–45 giây, súc kỹ quanh vùng đau.</li><li><b>Nhổ bỏ hoàn toàn.</b> Tuyệt đối không nuốt, không uống.</li><li><b>Sau khi dùng:</b> tránh ăn uống hoặc súc lại bằng nước sạch trong khoảng 15 phút.</li><li><b>2 lần mỗi ngày:</b> sáng khi ngủ dậy và tối trước khi đi ngủ.</li></ol><p>Không dùng cho trẻ em, phụ nữ có thai, người có bệnh lý hoặc tổn thương nặng về răng miệng. Đau nhiều hoặc kéo dài, bạn nên đi khám nha sĩ. Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.</p></details>'+
   '<div class="hang-nut"><button class="nut-chinh" data-mo="tien-ich">'+ic("i-timer")+'Mở đồng hồ ngậm</button><button class="nut-phu" data-mo="tat-ca-sp">Xem sản phẩm</button></div>')},
 "tien-ich":function(){if(QB.moTabHome&&QB.moTabHome("tien-ich"))return;veTienIch(mo("Tiện ích chăm sóc","",true))},
 "hoi-dap":function(){if(QB.moTabHome&&QB.moTabHome("hoi-dap"))return;veHoiDap(mo("Hỏi đáp thường gặp",""))},
 "so-sanh":function(){var a=SP.p350,b=SP.p500;mo("So sánh 350ml và Plus 500ml",'<div class="cuon-bang"><table class="bang-ss"><thead><tr><th></th><th><img src="'+im(a.anh)+'" alt="">Quê ngoại 350ml</th><th><img src="'+im(b.anh)+'" alt="">Quê ngoại Plus 500ml</th></tr></thead><tbody>'+
   '<tr><th>Thành phần</th><td>Rượu nếp, hạt cau</td><td>Rượu nếp, hạt cau, <b>lá bạc hà, quế</b></td></tr>'+
   '<tr><th>Dung tích</th><td>350ml</td><td>500ml</td></tr><tr><th>Giá 1 chai</th><td class="gia-ban">'+vnd(a.gia)+'</td><td class="gia-ban">'+vnd(b.gia)+'</td></tr>'+
   '<tr><th>Combo 3 chai</th><td>'+vnd(SP["c350-3"].gia)+', tặng 1 chai 350ml</td><td>'+vnd(SP["c500-3"].gia)+', tặng 1 chai 350ml</td></tr>'+
   '<tr><th>Cách dùng</th><td colspan="2">Giống nhau: chấm hoặc ngậm 30–45 giây, nhổ bỏ. 2 lần mỗi ngày.</td></tr>'+
   '<tr><th>Hạn dùng</th><td colspan="2">1 năm tính từ ngày nhận hàng</td></tr>'+
   '<tr><th></th><td><button class="nut-vang" data-xem="p350">Chọn 350ml</button></td><td><button class="nut-vang" data-xem="p500">Chọn Plus</button></td></tr></tbody></table></div>',true)},
 "cau-chuyen":function(){location.href=A+"cau-chuyen.html"},
 "lien-he":function(){mo("Liên hệ Quê ngoại",'<div class="lh-so"><div><small style="color:var(--mo)">Hotline đặt hàng, tư vấn</small><br><b>0342 756 219</b></div><button class="nut-phu" data-chep="0342756219">Chép số</button></div>'+
   '<a class="nut-vang" href="tel:0342756219" style="min-height:48px">'+ic("i-phone")+'Gọi ngay</a>'+
   '<div class="ds-kq"><a href="https://zalo.me/0342756219" target="_blank" rel="noopener">'+'<span class="zl" style="width:56px;height:56px;border-radius:12px;background:#0068FF;color:#fff;display:grid;place-items:center;font-weight:800">Zalo</span><span>Zalo tư vấn từ Quê ngoại<small>0342 756 219 · Bấm để nhắn ngay</small></span></a>'+
   '<a href="https://m.me/61596024572905" target="_blank" rel="noopener"><span style="width:56px;height:56px;border-radius:12px;background:linear-gradient(135deg,#00B2FF,#A033FF);color:#fff;display:grid;place-items:center">'+ic("i-msg")+'</span><span>Messenger fanpage Quê ngoại<small>Bấm để nhắn tin ngay</small></span></a>'+
   '<button data-mo="chat"><span style="width:56px;height:56px;border-radius:12px;background:var(--reu-900);color:var(--dong-sang);display:grid;place-items:center">'+ic("i-chat")+'</span><span>Hỏi trợ lý AI<small>Trả lời ngay về giá, cách dùng, giao hàng</small></span></button></div>'+
   '<p>Email: <b>quengoai0@gmail.com</b> · Địa chỉ: Nam Tiến, Xuân Mai, Hà Nội</p>')},
 "tat-ca-sp":function(){mo("Sản phẩm và combo",'<div class="ds-kq">'+QB.SP.map(function(p){return '<button data-xem="'+p.id+'"><img src="'+im(p.anh)+'" alt=""><span><b>'+p.ten+'</b><small>'+vnd(p.gia)+' · '+p.ship+(p.qua?" · "+quaChu(p):"")+'</small></span></button>'}).join("")+'</div>')},
 "danh-muc":moMega,
 "gio":function(){dong();moGio()},
 "chat":function(){dong();moChat()}
};
function moHop(k){
  if(k.indexOf("ho-tro:")===0){var h=QB.HO_TRO[k.slice(7)];if(h)mo(h.td,h.html+'<div class="hang-nut"><button class="nut-phu" data-mo="lien-he">'+ic("i-phone")+'Cần hỗ trợ thêm</button></div>');return}
  if(HOP[k])HOP[k]();
}
QB.moHop=moHop;

/* ===== Bấm chung ===== */
document.addEventListener("click",function(e){
  var t=e.target.closest("[data-mo],[data-xem],[data-mua],[data-them],[data-chep],[data-chua-co]");
  if(!t)return;
  if(t.dataset.mo){e.preventDefault();var k=t.dataset.mo;if(k!=="danh-muc")dongMega();if(k!=="gio"&&k!=="chat"&&k!=="danh-muc"&&!lop.hidden&&!(k.indexOf("ho-tro:")===0||HOP[k]))dong();moHop(k);return}
  if(t.dataset.xem){e.preventDefault();dongMega();$("#kq-tim").hidden=true;$("#thong-bao").hidden=true;xemNhanh(t.dataset.xem);return}
  if(t.dataset.mua){e.preventDefault();datNhanh([{id:t.dataset.mua,sl:1}]);return}
  if(t.dataset.them){e.preventDefault();themGio(t.dataset.them,1);return}
  if(t.dataset.chep){var so=t.dataset.chep;try{navigator.clipboard.writeText(so).then(function(){toast("Đã chép số "+so)},function(){toast("Số hotline: 0342 756 219")})}catch(er){toast("Số hotline: 0342 756 219")}return}
  if(t.hasAttribute("data-chua-co")){toast("Chủ shop chưa cung cấp link. Vui lòng gọi 0342 756 219.")}
});
$$(".mega a").forEach(function(a){a.addEventListener("click",dongMega)});
document.addEventListener("keydown",function(e){if(e.key!=="Escape")return;dongMega();dongGio();$("#chat").hidden=true;$("#thong-bao").hidden=true;if(!lop.hidden)dong()});

/* ===== Chuông thông báo ===== */
$("#nut-chuong").onclick=function(e){e.stopPropagation();var tb=$("#thong-bao");tb.hidden=!tb.hidden;this.setAttribute("aria-expanded",!tb.hidden);var hh=$(".huy-hieu",this);if(hh)hh.hidden=true};
document.addEventListener("click",function(e){if(!e.target.closest(".vi-tri-chuong"))$("#thong-bao").hidden=true;if(!e.target.closest(".tim"))$("#kq-tim").hidden=true});

/* ===== Tìm kiếm ===== */
var CHI_MUC=QB.SP.map(function(p){return {t:p.ten,ph:vnd(p.gia),a:p.anh,id:p.id,k:p.ten+" "+(p.ngan||"")+" combo"}}).concat(QB.BAI.map(function(b){return {t:b.tieu_de,ph:b.nhom==="cam-nang"?"Cẩm nang dân gian":"Bài viết",a:b.anh,href:urlBai(b.slug),k:b.tieu_de+" "+(b.tu_khoa||[]).join(" ")}}));
function timKiem(q){q=boDau(q.trim());if(q.length<2)return [];var tu=q.split(/\s+/);return CHI_MUC.filter(function(x){var s=boDau(x.k);return tu.every(function(w){return s.indexOf(w)>-1})})}
function dongKq(x){return x.href?'<a href="'+x.href+'"><img src="'+im(x.a)+'" alt=""><span>'+x.t+'<small>'+x.ph+'</small></span></a>':'<button data-xem="'+x.id+'"><img src="'+im(x.a)+'" alt=""><span>'+x.t+'<small>'+x.ph+'</small></span></button>'}
$("#o-tim").addEventListener("input",function(){
  var r=timKiem(this.value).slice(0,6),kq=$("#kq-tim");
  if(this.value.trim().length<2){kq.hidden=true;return}
  kq.innerHTML=r.length?r.map(dongKq).join(""):'<p style="padding:10px">Không thấy kết quả. Thử “combo”, “Plus”, “hôi miệng”.</p>';kq.hidden=false;
});
$("#form-tim").onsubmit=function(e){e.preventDefault();var q=$("#o-tim").value,r=timKiem(q);$("#kq-tim").hidden=true;$("#o-tim").blur();
  mo("Kết quả cho “"+q.replace(/</g,"")+"”",r.length?'<div class="ds-kq">'+r.map(dongKq).join("")+'</div>':'<p>Không thấy kết quả phù hợp.</p><div class="hang-nut"><button class="nut-phu" data-mo="tat-ca-sp">Xem tất cả sản phẩm</button><a class="nut-phu" href="'+BV+'index.html">Xem tất cả bài viết</a></div>')};

/* Từ khóa nhanh = các combo */
$("#tu-khoa").innerHTML='<a href="'+BV+'index.html#bai-viet">'+ic("i-book")+'Cẩm nang sức khỏe</a><a href="'+BV+'index.html#cam-nang">'+ic("i-leaf")+'Kinh nghiệm dân gian</a><a href="#" data-mo="tien-ich">'+ic("i-tool")+'Tiện ích</a><a href="#" data-mo="cach-dung">'+ic("i-swab")+'Cách dùng đúng</a><a href="#" data-mo="hoi-dap">'+ic("i-info")+'Hỏi đáp</a><a href="'+A+'cau-chuyen.html">'+ic("i-star")+'Câu chuyện Quê ngoại</a>';

/* Về đầu trang */
var lenDau=$("#len-dau");
window.addEventListener("scroll",function(){lenDau.hidden=window.scrollY<700},{passive:true});
lenDau.onclick=function(){window.scrollTo({top:0,behavior:"smooth"})};

/* ===== Trợ lý: kịch bản theo file 01, 02, 05 ===== */
var chat=$("#chat"),than=$("#chat-than"),daChao=false;
function tn(txt,ai,goiY){var d=document.createElement("div");d.className="tn "+(ai?"bot":"khach");d.textContent=txt;than.appendChild(d);
  if(goiY){var g=document.createElement("div");g.className="goi-y";g.innerHTML=goiY.map(function(x){return '<button type="button">'+x+'</button>'}).join("");than.appendChild(g)}than.scrollTop=than.scrollHeight}
var GOI_Y=["Hôi miệng","Đau nhức răng","Xem bảng giá","Cách dùng","Gặp người tư vấn"];
function traLoi(q){var s=boDau(q);
  if(/do con|bao nhieu do|nong do/.test(s))return "Câu hỏi này Quê ngoại sẽ trả lời trực tiếp. Bạn vui lòng gọi hotline 0342 756 219.";
  if(/uong|nuot/.test(s))return "Rượu cau chỉ dùng trong khoang miệng: chấm hoặc ngậm rồi nhổ bỏ hoàn toàn, tuyệt đối không nuốt hay uống.";
  if(/thuoc|chua|khoi/.test(s))return "Rượu cau là sản phẩm chăm sóc, hỗ trợ tại chỗ theo kinh nghiệm dân gian, không phải thuốc. Bạn vẫn nên đi khám nha sĩ định kỳ.";
  if(/tre|\bbe\b|bau|mang thai|co thai/.test(s))return "Sản phẩm không dùng cho trẻ em, phụ nữ có thai và người có bệnh lý hoặc tổn thương nặng về răng miệng.";
  if(/ship|giao hang|van chuyen|bao lau/.test(s))return "Nội thành giao 1–2 ngày, các tỉnh 3–5 ngày. Từ combo 2 chai được miễn phí ship, đơn 1 chai tính phí ship theo thực tế. Bạn được kiểm tra hàng khi nhận.";
  if(/hoi mieng|hoi tho/.test(s))return "Theo kinh nghiệm dân gian, rượu cau giúp khử mùi hôi và tăng tiết nước bọt trong khoang miệng.\nCách dùng: ngậm 10–15ml trong 30–45 giây rồi nhổ bỏ, 2 lần mỗi ngày.\nGợi ý: Combo 2 chai 350ml giá 300.000đ, miễn phí ship.";
  if(/dau rang|nhuc|sung|nuou|viem loi|sau rang/.test(s))return "Rượu cau hỗ trợ làm dịu các cơn đau nhức răng, sâu răng nhẹ hoặc sưng nướu tạm thời.\nCách dùng: chấm tăm bông lên vùng đau, hoặc ngậm 10–15ml trong 30–45 giây rồi nhổ bỏ.\nNếu đau nhiều hoặc kéo dài, bạn nên đi khám nha sĩ để tìm đúng nguyên nhân.";
  if(/\bgia\b|bang gia|bao nhieu tien|combo/.test(s))return "Bảng giá:\n• Chai 350ml: 150.000đ\n• Chai Plus 500ml: 200.000đ\n• Combo 2 chai 350ml: 300.000đ, miễn phí ship\n• Combo 3 chai 350ml: 420.000đ, tặng 1 chai 350ml\n• Combo 3 chai Plus: 560.000đ, tặng 1 chai 350ml\nTừ 2 chai được miễn phí ship.";
  if(/cach dung|dung the nao|ngam|cham/.test(s))return "Cách 1: chấm tăm bông sạch lên vùng răng, nướu đau.\nCách 2: ngậm 10–15ml trong 30–45 giây rồi nhổ bỏ hoàn toàn.\nDùng 2 lần mỗi ngày, sáng và tối. Sau khi dùng chờ khoảng 15 phút mới ăn uống.";
  if(/doi|tra hang|hoan/.test(s))return "Quê ngoại nhận đổi trả trong 2 ngày nếu sản phẩm sai mẫu, sai dung tích, lỗi, vỡ hoặc biến màu bất thường. Các yêu cầu khác, bạn vui lòng gọi 0342 756 219.";
  if(/han|bao quan/.test(s))return "Hạn dùng 1 năm tính từ ngày nhận hàng. Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.";
  if(/tu van|nguoi|goi|lien he/.test(s))return "Bạn gọi hotline 0342 756 219, hoặc để lại số điện thoại ở mục “Đăng ký tư vấn ngay” để Quê ngoại gọi lại.";
  return "Câu hỏi này cần người tư vấn trả lời. Bạn vui lòng gọi 0342 756 219.";}
function moChat(){dongMega();dongGio();chat.hidden=false;$$("[data-chat-badge]").forEach(function(b){b.hidden=true});
  if(!daChao){daChao=true;tn("Xin chào! Trợ lý AI Quê ngoại có thể giúp bạn chọn sản phẩm, xem giá và cách dùng đúng. Bạn đang quan tâm điều gì?",true,GOI_Y)}}
$("#chat-dong").onclick=function(){chat.hidden=true};
than.addEventListener("click",function(e){var b=e.target.closest(".goi-y button");if(b)hoi(b.textContent)});
function hoi(q){tn(q,false);setTimeout(function(){tn(traLoi(q),true)},350)}
$("#chat-form").onsubmit=function(e){e.preventDefault();var v=$("#chat-o").value.trim();if(!v)return;$("#chat-o").value="";hoi(v)};

/* Dải khẩu hiệu: xoay 2 thông điệp */
(function(){var p=$(".dai-kh p");if(!p)return;var c=[p.innerHTML,'<span class="ship-chu">'+ic("i-truck")+'Mua từ 2 chai</span> · <b>Miễn phí ship</b>'],i=0;
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  setInterval(function(){i=1-i;p.classList.add("mo");setTimeout(function(){p.innerHTML=c[i];p.classList.remove("mo")},350)},4500)})();
/* Tin nhắn mời trợ lý */
(function(){var k="qb-moi-chat";try{if(sessionStorage.getItem(k))return}catch(e){}
  var d=document.createElement("div");d.className="chat-moi";d.hidden=true;
  d.innerHTML='<button class="cm-than" data-mo="chat"><svg viewBox="0 0 64 64" class="cm-av"><use href="#av-tro-ly"/></svg><span><b>Trợ lý Quê ngoại</b>Xin chào! Bạn cần tư vấn chọn loại rượu cau phù hợp? Hỏi ngay nhé.</span></button><button class="cm-x" aria-label="Đóng lời mời">'+ic("i-close")+'</button>';
  document.body.appendChild(d);
  function an(){d.hidden=true;try{sessionStorage.setItem(k,"1")}catch(e){}}
  d.querySelector(".cm-x").onclick=an;d.querySelector(".cm-than").addEventListener("click",an);
  document.addEventListener("click",function(e){if(e.target.closest("[data-mo='chat']")&&!e.target.closest(".chat-moi"))an()});
  setTimeout(function(){if(chat.hidden&&lop.hidden)d.hidden=false},2500);})();
})();
