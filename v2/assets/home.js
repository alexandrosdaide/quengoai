/* Quê ngoại: phần riêng của trang chủ */
(function(){
"use strict";
var u=QB.u,$=u.$,$$=u.$$,vnd=u.vnd,im=u.im,ic=u.ic,SP=u.SP,BAI=u.BAI;

/* Hero */
var slIdx=0,slTimer=null;
$("#slides").innerHTML=QB.SLIDES.map(function(s,i){
  var p=SP[s.sp];
  return '<div class="slide'+(i===0?" dang":"")+'" role="group" aria-roledescription="slide" aria-label="'+(i+1)+' / '+QB.SLIDES.length+'">'+
   '<div class="slide-noi"><span class="mat">'+s.mat+'</span><h2>'+s.td+'</h2><p>'+s.mt+'</p>'+(s.canh?'<p class="canh">'+s.canh+'</p>':'')+
   '<div class="slide-combo">'+(p.so?'<span class="gia">'+vnd(p.gia)+'</span><span class="the">'+p.ten.replace("Quê ngoại ","")+' · ≈ '+vnd(Math.round(p.gia/p.so/1000)*1000)+'/chai</span>':'<span class="gia">'+vnd(p.gia)+'<small>/chai</small></span><span class="the">'+p.ten.replace("Rượu cau ","")+'</span>')+(p.qua?'<span class="the qua">'+ic("i-gift")+u.quaChu(p)+'</span>':'')+'<span class="the ship">'+ic("i-truck")+(p.so?'Miễn phí ship':'Từ 2 chai: miễn phí ship')+'</span></div>'+
   '<div class="slide-nut"><button class="nut-vang" data-mua="'+p.id+'">Mua ngay</button><button class="nut-vien-sang" data-xem="'+p.id+'">Xem chi tiết</button></div></div>'+
   '<div class="anh">'+(p.qua?'<span class="sticker-qua">Tặng<b>+'+p.qua+'</b>chai</span>':'')+'<img src="'+s.nen+'" alt="'+p.ten+' trong bối cảnh nhà quê" '+(i?'loading="lazy"':'fetchpriority="high"')+'></div></div>';
}).join("");
$("#sl-cham").innerHTML=QB.SLIDES.map(function(s,i){return '<button aria-label="Slide '+(i+1)+'"'+(i===0?' aria-current="true"':'')+'></button>'}).join("");
function denSlide(i){var ds=$$(".slide"),ch=$$("#sl-cham button");slIdx=(i+ds.length)%ds.length;
  ds.forEach(function(d,k){d.classList.toggle("dang",k===slIdx)});ch.forEach(function(c,k){if(k===slIdx)c.setAttribute("aria-current","true");else c.removeAttribute("aria-current")})}
function chay(){dung();if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)slTimer=setInterval(function(){denSlide(slIdx+1)},6000)}
function dung(){clearInterval(slTimer)}
$("#sl-truoc").onclick=function(){denSlide(slIdx-1);chay()};$("#sl-sau").onclick=function(){denSlide(slIdx+1);chay()};
$$("#sl-cham button").forEach(function(b,i){b.onclick=function(){denSlide(i);chay()}});
var sl=$("#slider");sl.addEventListener("mouseenter",dung);sl.addEventListener("mouseleave",chay);
var x0=null,y0=null;sl.addEventListener("touchstart",function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY;dung()},{passive:true});
sl.addEventListener("touchend",function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){denSlide(slIdx+(dx<0?1:-1))}x0=null;chay()});
chay();

/* Thẻ sản phẩm */
$("#ray-noi-bat").innerHTML=["p350","p500","c350-2","c350-3","c500-3","c350-12"].map(function(id){return QB.theSp(SP[id])}).join("");
$("#ray-combo").innerHTML=["c350-2","c350-3","c350-5","c350-12","c500-2","c500-3","c500-5","c500-12"].map(function(id){return QB.theSp(SP[id])}).join("");
$("#hang-nhom").innerHTML=QB.HANG.map(function(h,i){
  return '<section class="khoi'+(i%2?' nen-giay':'')+'" aria-label="'+h.td+'"><div class="khung"><div class="tieu-de"><div class="dau-gach"><div><h2>'+h.td+'</h2><p class="mo-ta">'+h.mt+'</p></div></div><a class="xem-them" href="#combo">Xem thêm '+ic("i-right","width:16px;height:16px")+'</a></div>'+
  '<div class="bang" data-bang><div class="bang-ray">'+h.ds.map(function(id){return QB.theSp(SP[id],h.anh[id])}).join("")+'</div></div></div></section>';
}).join("");
$$("[data-bang]").forEach(function(b){var ray=$(".bang-ray",b),t=$("[data-truoc]",b),s=$("[data-sau]",b);
  if(t)t.onclick=function(){ray.scrollBy({left:-ray.clientWidth*0.9,behavior:"smooth"})};
  if(s)s.onclick=function(){ray.scrollBy({left:ray.clientWidth*0.9,behavior:"smooth"})};});

/* Ô vấn đề */
$("#o-van-de").innerHTML=QB.OVD.map(function(o,i){return '<button aria-pressed="'+(i===0)+'" data-o="'+o.id+'">'+ic(o.ic)+o.ten+'</button>'}).join("");
function theNgang(id,vaiTro){var p=SP[id];
  return '<div class="the-ngang"><img src="'+im(p.anh)+'" alt="" data-xem="'+p.id+'" style="cursor:pointer"><div><span class="nhan'+(p.so?"":" xanh")+'">'+vaiTro+'</span><div class="ten" title="'+p.ten+'">'+p.ten.replace("Quê ngoại",'<span class="nobr">Quê ngoại</span>')+'</div><span class="gia-ban">'+vnd(p.gia)+'</span>'+(p.le>p.gia?'<span class="gia-goc">'+vnd(p.le)+'</span>':'')+'</div><button class="nut-xem" data-xem="'+p.id+'">Xem</button></div>'}
function chonO(id,cuon){
  var o=QB.OVD.filter(function(x){return x.id===id})[0]||QB.OVD[0];
  $$("#o-van-de button").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.o===o.id)});
  var p1=SP[o.sp[0]],p2=SP[o.sp[1]],bai=BAI[o.bai];
  var nb=(QB.NB||{})[o.id];
  function ds(td,ic2,arr,cls){return arr&&arr.length?'<div class="nb-o '+cls+'"><h4>'+ic(ic2)+td+'</h4><ul>'+arr.map(function(x){return '<li>'+x+'</li>'}).join("")+'</ul></div>':''}
  $("#khung-dong").innerHTML=(nb?'<div class="nb-dau"><span class="nb-nhan">Nhận biết</span><p>'+nb.tom_tat+'</p></div><div class="nb-luoi">'+ds(o.id==="lan-dau"?"Băn khoăn thường gặp":o.id==="ca-nha"?"Ai dùng được, ai không nên":o.id==="di-kham"?"Nên đặt lịch khám khi":"Dấu hiệu thường gặp","i-info",nb.dau_hieu,"c1")+ds("Nguyên nhân hay gặp","i-dot",nb.nguyen_nhan,"c2")+ds("Cách dùng đúng","i-swab",nb.cach_dung,"c2")+ds("Gợi ý chọn gói","i-gift",nb.goi_y_goi,"c2")+ds("Chăm sóc tại nhà","i-sun",nb.tai_nha,"c3")+ds(o.id==="di-kham"?"Cần đi cấp cứu ngay khi":"Khi nào nên đi khám","i-alert",nb.khi_nao_kham,"c4")+'</div>':'<p class="nhan-biet">Nhận biết: <b>'+o.nb+'</b>.</p>')+
   '<p class="ho-tro">'+ic(o.canhBao?"i-alert":"i-leaf")+'<span>'+o.ht+'</span></p>'+
   '<div class="the-ngang-luoi">'+theNgang(o.sp[0],p1.so?"Combo ưu đãi":"Sản phẩm chính")+theNgang(o.sp[1],p2.so?"Combo ưu đãi":"Sản phẩm chính")+'</div>'+
   '<div class="hang-nut"><button class="nut-chinh" data-mua="'+p1.id+'">'+ic("i-cart")+'Mua '+p1.ten+'</button><button class="nut-phu" data-mua="'+p2.id+'">'+ic("i-gift")+p2.ten+'</button>'+(o.tienIch?'<button class="nut-phu" data-mo="tien-ich">'+ic("i-timer")+'Mở đồng hồ ngậm</button>':'')+(o.canhBao?'<button class="nut-phu" data-mo="lien-he">'+ic("i-phone")+'Gọi tư vấn</button>':'')+'</div>'+
   (bai?'<a class="lien-bai" href="'+u.urlBai(bai.slug)+'">'+ic("i-book")+bai.tieu_de+'</a>':'');
  if(cuon&&window.innerWidth<720){var k=$("#khung-dong");setTimeout(function(){window.scrollTo({top:k.getBoundingClientRect().top+window.scrollY-150,behavior:"smooth"})},50)}
}
$("#o-van-de").addEventListener("click",function(e){var b=e.target.closest("button[data-o]");if(b)chonO(b.dataset.o,true)});
chonO("hoi-mieng");

/* Tab */
var daVe={};
function moTab(ten){["tinh-trang","tien-ich","hoi-dap"].forEach(function(t){$("#tab-"+t).setAttribute("aria-selected",t===ten);$("#pn-"+t).hidden=t!==ten});
  if(ten==="tien-ich"&&!daVe.ti){QB.veTienIch($("#pn-tien-ich"));daVe.ti=1}
  if(ten==="hoi-dap"&&!daVe.hd){QB.veHoiDap($("#pn-hoi-dap"));daVe.hd=1}}
$$(".tab-hang [role=tab]").forEach(function(b){b.onclick=function(){moTab(b.id.replace("tab-",""))}});
QB.moTabHome=function(ten){moTab(ten);var s=$("#chon-van-de");window.scrollTo({top:s.getBoundingClientRect().top+window.scrollY-(window.innerWidth<720?130:170),behavior:"smooth"});return true};

/* Bài viết */
function meta(b){return '<div class="meta"><span>'+ic("i-clock")+b.thoi_gian_doc+' phút đọc</span><span>'+ic("i-user")+'Quê ngoại</span></div>'}
var moi=QB.BAI.filter(function(b){return b.nhom==="bai-viet"}),cn=QB.BAI.filter(function(b){return b.nhom==="cam-nang"});
var b0=moi[0];
$("#blog").innerHTML='<a class="bai-lon" href="'+u.urlBai(b0.slug)+'"><div class="anh"><img src="'+im(b0.anh)+'" alt="" loading="lazy"></div><h3>'+b0.tieu_de+'</h3>'+meta(b0)+'<p>'+b0.tom_tat+'</p></a>'+
 '<div class="ds-bai">'+moi.slice(1,5).map(function(b){return '<a class="bai-nho" href="'+u.urlBai(b.slug)+'"><div class="anh"><img src="'+im(b.anh)+'" alt="" loading="lazy"></div><div><h3>'+b.tieu_de+'</h3>'+meta(b)+'<p>'+b.tom_tat+'</p></div></a>'}).join("")+'</div>';
$("#cn-luoi").innerHTML=cn.slice(0,6).map(function(b){return '<a class="bai-cn" href="'+u.urlBai(b.slug)+'"><div class="anh"><img src="'+im(b.anh)+'" alt="" loading="lazy"></div><div><h3>'+b.tieu_de+'</h3>'+meta(b)+'<p>'+b.tom_tat+'</p></div></a>'}).join("");

/* Form tư vấn */
$("#form-tv").onsubmit=function(e){e.preventDefault();var loi="";
  if(!$("#tv-ten").value.trim())loi="Vui lòng nhập họ và tên.";else if(!QB.kiemSdt($("#tv-sdt").value))loi="Số điện thoại chưa đúng, ví dụ 0912 345 678.";else if(!$("#tv-dongy").checked)loi="Vui lòng tích đồng ý để Quê ngoại gọi tư vấn.";
  $("#tv-loi").textContent=loi;if(loi)return;var sdt=$("#tv-sdt").value;this.reset();
  QB.mo("Đã nhận đăng ký",'<div class="thanh-cong"><div class="vong">'+ic("i-check")+'</div><h3 style="font-size:22px">Cảm ơn bạn</h3><p>Quê ngoại sẽ gọi lại số <b>'+sdt.replace(/</g,"")+'</b> để tư vấn.</p><p class="ghi-thu">Bản thử: đăng ký chưa được gửi đi vì web chưa nối nơi nhận.</p><button class="nut-chinh" data-dong>Đóng</button></div>')};
})();
