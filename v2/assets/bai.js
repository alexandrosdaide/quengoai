/* Quê ngoại: trang bài viết và trang danh sách bài */
(function(){
"use strict";
var u=QB.u,$=u.$,$$=u.$$;
/* Thanh tiến độ đọc + mục lục đang đọc */
var td=$("#tien-do"),nd=$(".noi-dung");
if(td&&nd){
  var h2=$$(".noi-dung h2"),ml=$$(".muc-luc a");
  window.addEventListener("scroll",function(){
    var r=nd.getBoundingClientRect(),h=r.height-window.innerHeight*0.6,p=Math.min(1,Math.max(0,-r.top/(h||1)));
    td.style.width=(p*100)+"%";
    var cur=null;h2.forEach(function(x){if(x.getBoundingClientRect().top<200)cur=x.id});
    ml.forEach(function(a){a.classList.toggle("dang",a.getAttribute("href")==="#"+cur)});
  },{passive:true});
}
/* Chép link */
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-chep-link]");if(!b)return;
  try{navigator.clipboard.writeText(location.href).then(function(){u.toast("Đã chép link bài viết")},function(){u.toast("Không chép được, bạn hãy chép link trên thanh địa chỉ")})}catch(er){u.toast("Không chép được, bạn hãy chép link trên thanh địa chỉ")}
});
/* Lọc trang danh sách */
var loc=$(".loc");
if(loc){
  function chon(n){$$(".loc button").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.loc===n)});
    $$(".ds-bai-trang .the-bai").forEach(function(a){a.hidden=!(n==="tat-ca"||a.dataset.nhom===n)})}
  loc.addEventListener("click",function(e){var b=e.target.closest("[data-loc]");if(b)chon(b.dataset.loc)});
  var h=(location.hash||"").slice(1);chon(h==="cam-nang"||h==="bai-viet"?h:"tat-ca");
  window.addEventListener("hashchange",function(){var h=location.hash.slice(1);if(h==="cam-nang"||h==="bai-viet")chon(h)});
}
})();
