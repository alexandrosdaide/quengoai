const {chromium}=require('playwright');
const OUT='/tmp/claude-0/-home-claude/4c64857a-ab5f-5a0e-b374-2c7d5ad39e0e/scratchpad/v2-';
(async()=>{
 const b=await chromium.launch();
 const errs=[];
 async function pg(w,h){const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1,hasTouch:w<500,isMobile:w<500});p.on('pageerror',e=>errs.push(w+' '+e.message));return p}
 const base='file:///home/claude/queba-web/dist/';
 for (const [w,h,n] of [[390,844,'m'],[1440,900,'d']]){
   const p=await pg(w,h);
   await p.goto(base+'index.html');await p.waitForTimeout(500);
   const H=await p.evaluate(()=>document.body.scrollHeight);
   for(let y=0;y<H;y+=700){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(40)}
   await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(400);
   await p.screenshot({path:OUT+n+'-home.png',fullPage:true});
   console.log(n,'overflow',await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth));
   // interactions
   const steps=[['[data-mua="c350-2"]','datnhanh'],['[data-xem="p500"]','xemnhanh'],['[data-mo="so-sanh"]','sosanh'],['[data-mo="cach-dung"]','cachdung'],['[data-mo="lien-he"]','lienhe'],['[data-mo="ho-tro:doi-tra"]','doitra']];
   for(const [sel,name] of steps){
     await p.evaluate(s=>{const e=document.querySelector(s);e.click()},sel);await p.waitForTimeout(350);
     await p.screenshot({path:OUT+n+'-'+name+'.png'});
     await p.evaluate(()=>QB.dong());
   }
   await p.evaluate(()=>document.querySelector('[data-mo="danh-muc"]').click());await p.waitForTimeout(250);await p.screenshot({path:OUT+n+'-danhmuc.png'});
   await p.keyboard.press('Escape');
   await p.evaluate(()=>document.querySelector('[data-mo="chat"]').click());await p.waitForTimeout(250);await p.screenshot({path:OUT+n+'-chat.png'});
   await p.keyboard.press('Escape');
   // order flow
   await p.evaluate(()=>QB.datNhanh([{id:'p350',sl:2}]));await p.waitForTimeout(200);
   await p.fill('#dn-ten','Nguyễn Văn A');await p.fill('#dn-sdt','0912345678');await p.fill('#dn-dc','12 Đường A, Xuân Mai, Hà Nội');
   await p.evaluate(()=>document.querySelector('#form-dn button[type=submit]').click());await p.waitForTimeout(250);
   await p.screenshot({path:OUT+n+'-donxong.png'});await p.evaluate(()=>QB.dong());
   await p.close();
   const a=await pg(w,h);
   await a.goto(base+'bai-viet/dau-nhuc-rang-cach-lam-diu-tai-nha.html');await a.waitForTimeout(400);
   await a.screenshot({path:OUT+n+'-bai-top.png'});
   await a.evaluate(()=>scrollTo(0,1800));await a.waitForTimeout(300);await a.screenshot({path:OUT+n+'-bai-giua.png'});
   console.log(n,'bai overflow',await a.evaluate(()=>document.documentElement.scrollWidth-innerWidth));
   await a.goto(base+'bai-viet/index.html#cam-nang');await a.waitForTimeout(300);await a.screenshot({path:OUT+n+'-ds.png'});
   await a.close();
 }
 console.log('errs',JSON.stringify(errs));
 await b.close();
})();
