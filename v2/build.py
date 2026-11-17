#!/usr/bin/env python3
"""Dựng web Quê ngoại v2. Ra 2 bản:
 - dist/        : bản triển khai (index.html, bai-viet/*.html, assets/, img/)
 - art/         : bản xem thử Artifact (trang chính không có doctype + trang-chu.html)
"""
import time,json, os, re, shutil, glob, html
R=os.path.dirname(os.path.abspath(__file__))
ROOT=os.path.dirname(R)
IMG_SRC=[os.path.join(ROOT,'img'),os.path.join(ROOT,'work','web')]
ART_DIR=os.path.join(ROOT,'content','articles')
NGAY='30/10/2026'; NGAY_ISO='2026-10-30'

THU_TU_BV=['dau-nhuc-rang-cach-lam-diu-tai-nha','hoi-mieng-nguyen-nhan-va-cach-cai-thien','sung-nuou-viem-loi-nguyen-nhan-cach-cham-soc','dau-hieu-sau-rang-giai-doan-dau','khi-nao-can-di-kham-nha-si']
THU_TU_CN=['suc-mieng-nuoc-muoi-am-dung-cach','la-trau-khong-suc-mieng','la-oi-non-suc-mieng','dinh-huong-diu-dau-rang','suc-mieng-tra-xanh','keo-dau-dua-suc-mieng','trau-cau-va-ruou-cau-cua-ba']
# Địa chỉ gốc cho thẻ chia sẻ (Open Graph). Đổi khi có tên miền chính thức.
SITE=os.environ.get('QB_SITE','https://quengoai.pages.dev/')
# Bản chính thức: cho Google đọc trang, có sitemap và canonical. Đặt QB_NHAP=1 để xuất bản nháp (chặn Google).
NHAP=os.environ.get('QB_NHAP')=='1'
ANH={'dau-nhuc-rang-cach-lam-diu-tai-nha':'bv-dau-rang.jpg','hoi-mieng-nguyen-nhan-va-cach-cai-thien':'bv-hoi-mieng.jpg','sung-nuou-viem-loi-nguyen-nhan-cach-cham-soc':'bv-sung-nuou.jpg','dau-hieu-sau-rang-giai-doan-dau':'bv-sau-rang.jpg','khi-nao-can-di-kham-nha-si':'bv-nha-si.jpg',
 'suc-mieng-nuoc-muoi-am-dung-cach':'bv-nuoc-muoi.jpg','la-trau-khong-suc-mieng':'bv-la-trau.jpg','la-oi-non-suc-mieng':'bv-la-oi.jpg','dinh-huong-diu-dau-rang':'bv-dinh-huong.jpg','suc-mieng-tra-xanh':'bv-tra-xanh.jpg','keo-dau-dua-suc-mieng':'bv-dau-dua.jpg','trau-cau-va-ruou-cau-cua-ba':'bv-trau-cau.jpg'}

def doc(p): return open(os.path.join(R,p),encoding='utf-8').read()
def slugify(s):
    import unicodedata
    s=unicodedata.normalize('NFD',s.replace('đ','d').replace('Đ','D'))
    s=''.join(c for c in s if unicodedata.category(c)!='Mn').lower()
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')[:60]

# ---------- Bài viết ----------
bai={}
for f in glob.glob(os.path.join(ART_DIR,'*.json')):
    d=json.load(open(f,encoding='utf-8')); bai[d['slug']]=d
thu_tu=[s for s in THU_TU_BV+THU_TU_CN if s in bai]
# Bài mới (không có trong 2 danh sách trên) tự xếp lên trước, mới nhất trước
moi=sorted([s for s in bai if s not in thu_tu],key=lambda s:bai[s].get('ngay','2026-10-30'),reverse=True)
thu_tu=moi+thu_tu
for s in thu_tu:
    d=bai[s]; d['anh']='img/'+(d.get('anh_file') or ANH.get(s,'bv-chum.jpg'))
    # mục lục: gán id cho h2
    toc=[]; used=set()
    def gan(m):
        t=re.sub('<[^>]+>','',m.group(2)); i=slugify(t) or 'muc'
        while i in used: i+='-2'
        used.add(i); toc.append((i,t)); return '<h2 id="%s"%s>%s</h2>'%(i,m.group(1),m.group(2))
    h=re.sub(r'<h2([^>]*)>(.*?)</h2>',gan,d['noi_dung_html'],flags=re.S)
    h=re.sub(r'<table',r'<div class="cuon-bang"><table',h); h=h.replace('</table>','</table></div>')
    d['html']=h; d['toc']=toc
bai_js=[{k:bai[s][k] for k in ('slug','nhom','tieu_de','tom_tat','anh','thoi_gian_doc','tu_khoa')} for s in thu_tu]

# ---------- Tài sản dùng chung ----------
css=doc('assets/_base.css')+doc('assets/_add.css')+doc('assets/_resp.css')
NB_F=os.path.join(ROOT,'content','nhan-biet.json')
nb=json.load(open(NB_F,encoding='utf-8')) if os.path.exists(NB_F) else {}
data_js=doc('assets/data.tpl.js').replace('/*BAI*/[]',json.dumps(bai_js,ensure_ascii=False)).replace('/*NB*/{}',json.dumps(nb,ensure_ascii=False))
sprite=doc('partials/sprite.html'); header=doc('partials/header.html'); footer=doc('partials/footer.html')
FONT='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Lora:ital,wght@0,500;0,600;0,700;1,500&display=swap">'

def sub(t,A,HOME,HOME_ANCHOR,BV):
    return t.replace('{{A}}',A).replace('{{HOME_ANCHOR}}',HOME_ANCHOR).replace('{{HOME}}',HOME).replace('{{BV}}',BV)

def og_wh(f):
    try:
        from PIL import Image
        for d in (os.path.join(ROOT,'work','web'),os.path.join(ROOT,'img')):
            fp=os.path.join(d,os.path.basename(f))
            if os.path.exists(fp):
                w,h=Image.open(fp).size
                return f'<meta property="og:image:width" content="{w}">\n<meta property="og:image:height" content="{h}">\n'
    except Exception: pass
    return ''
def ngay_vn(d):
    y,m,dd=d.get('ngay',NGAY_ISO).split('-'); return f'{dd}/{m}/{y}'

def trang(title,desc,body,A,HOME,HOME_ANCHOR,BV,js,extra_head='',doctype=True,og_img='img/og-que-ngoai.jpg',duong=''):
    rb='<meta name="robots" content="noindex, nofollow">' if NHAP else f'<meta name="robots" content="index, follow, max-image-preview:large">\n<link rel="canonical" href="{SITE}{duong}">\n<meta property="og:url" content="{SITE}{duong}">'
    head=(f'<title>{html.escape(title)}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n{rb}\n'
          f'<meta name="description" content="{html.escape(desc)}">\n<meta property="og:title" content="{html.escape(title)}">\n'
          f'<meta property="og:description" content="{html.escape(desc)}">\n<meta property="og:image" content="{SITE}{og_img}">\n'
          f'{og_wh(og_img)}<meta property="og:image:alt" content="{html.escape(title)}">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Quê ngoại">\n<meta property="og:locale" content="vi_VN">\n<meta name="twitter:card" content="summary_large_image">\n'
          f'<link rel="icon" href="{A}img/logo-xanh.svg">\n{FONT}\n<link rel="stylesheet" href="{A}assets/site.css">\n{extra_head}')
    scripts=(f'<script>window.QB={{A:"{A}",BV:"{BV}"}};</script>\n<script src="{A}assets/data.js"></script>\n<script src="{A}assets/site.js"></script>\n'
             +''.join(f'<script src="{A}assets/{j}"></script>\n' for j in js))
    content=sprite+sub(header,A,HOME,HOME_ANCHOR,BV)+body+sub(footer,A,HOME,HOME_ANCHOR,BV)+scripts
    if not doctype:  # Artifact: không tự viết html/head/body
        return head+content
    return ('<!doctype html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            +head+'<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}</style>\n</head>\n<body>\n'
            +content+'</body>\n</html>\n')

def the_bai(b,A,BV):
    return (f'<a class="the-bai" href="{BV}{b["slug"]}.html" data-nhom="{b["nhom"]}"><div class="anh"><img src="{A}{b["anh"]}" alt="" loading="lazy"></div>'
            f'<div><span class="nhom">{"Cẩm nang dân gian" if b["nhom"]=="cam-nang" else "Sức khỏe răng miệng"}</span><h3>{b["tieu_de"]}</h3>'
            f'<div class="meta"><span><svg class="icon"><use href="#i-clock"/></svg>{b["thoi_gian_doc"]} phút đọc</span></div><p>{b["tom_tat"]}</p></div></a>')

def trang_bai(d,A,HOME,BV):
    nhom='Cẩm nang dân gian' if d['nhom']=='cam-nang' else 'Sức khỏe răng miệng'
    ol=''.join(f'<li><a href="#{i}">{html.escape(t)}</a></li>' for i,t in d['toc'])
    nguon=''.join(f'<li><a href="{html.escape(n["url"])}" target="_blank" rel="noopener">{html.escape(n["ten"])}</a></li>' for n in d.get('nguon',[]))
    lq=[bai[s] for s in thu_tu if s!=d['slug'] and bai[s]['nhom']==d['nhom']][:3]
    hop_sp=(f'<div class="hop-sp-bai"><img src="{A}img/bc-chum-doi.jpg" alt="Rượu cau Quê ngoại 350ml và Plus 500ml" loading="lazy"><div>'
            '<h3>Rượu cau Quê ngoại</h3><p>Theo kinh nghiệm dân gian, hỗ trợ làm dịu đau nhức răng, sưng nướu tạm thời và giúp khử mùi hôi khoang miệng. Chỉ dùng trong khoang miệng, nhổ bỏ, không nuốt. Không phải thuốc.</p>'
            '<button class="nut-vang" data-xem="p350">Xem sản phẩm</button><button class="nut-vien-sang" data-mo="so-sanh" style="justify-content:center">So sánh 350ml và Plus</button></div></div>')
    body=(f'<div class="tien-do" id="tien-do"></div><main><div class="khung">'
      f'<nav class="duong-dan" aria-label="Đường dẫn"><a href="{HOME}">Trang chủ</a><span>›</span><a href="index.html#{d["nhom"]}">{nhom}</a></nav>'
      f'<div class="bai-luoi"><article><div class="bai-dau"><span class="nhom" style="font-size:12px;font-weight:700;color:var(--cau);text-transform:uppercase;letter-spacing:.06em">{nhom}</span><h1>{d["tieu_de"]}</h1>'
      f'<div class="meta"><span><svg class="icon"><use href="#i-cal"/></svg>{ngay_vn(d)}</span><span><svg class="icon"><use href="#i-clock"/></svg>{d["thoi_gian_doc"]} phút đọc</span><span><svg class="icon"><use href="#i-user"/></svg>Quê ngoại</span>{"<span class=\"nhap\">Bản nháp chờ duyệt</span>" if NHAP else ""}</div></div>'
      f'<div class="bai-bia"><img src="{A}{d["anh"]}" alt="{html.escape(d.get("chu_de_anh",""))}" fetchpriority="high"></div>'
      f'<details class="muc-luc muc-luc-dt"><summary><b style="display:inline">Mục lục bài viết</b></summary><ol style="margin-top:8px">{ol}</ol></details>'
      f'<div class="noi-dung">{d["html"]}</div>'
      f'<p class="mien-tru">Thông tin trong bài chỉ để tham khảo, không thay thế chẩn đoán và điều trị của nha sĩ.</p>'
      f'<div class="chia-se"><button class="nut-phu" data-chep-link><svg class="icon"><use href="#i-book"/></svg>Chép link bài viết</button><a class="nut-phu" href="index.html">Xem tất cả bài viết</a></div>'
      f'</article><aside class="ben"><nav class="muc-luc" aria-label="Mục lục"><b>Mục lục</b><ol>{ol}</ol></nav>{hop_sp}</aside></div></div></main>'
      f'<section class="lien-quan"><div class="khung"><div class="tieu-de"><div class="dau-gach"><h2>Bài viết liên quan</h2></div></div><div class="lq-luoi">{"".join(the_bai(b,A,BV) for b in lq)}</div></div></section>')
    ld={"@context":"https://schema.org","@type":"Article","headline":d['tieu_de'],"description":d['meta'],"datePublished":d.get("ngay",NGAY_ISO),"dateModified":d.get("cap_nhat",d.get("ngay",NGAY_ISO)),"mainEntityOfPage":SITE+"bai-viet/"+d["slug"]+".html","inLanguage":"vi","author":{"@type":"Organization","name":"Quê ngoại"},"publisher":{"@type":"Organization","name":"Quê ngoại"}}
    extra='<script type="application/ld+json">'+json.dumps(ld,ensure_ascii=False)+'</script>\n'
    return body,extra

def trang_ds(A,HOME,BV):
    the=''.join(the_bai(bai[s],A,BV) for s in thu_tu)
    return (f'<main><div class="khung"><nav class="duong-dan" aria-label="Đường dẫn"><a href="{HOME}">Trang chủ</a><span>›</span><span>Cẩm nang sức khỏe</span></nav>'
            f'<div class="dau-ds"><h1>Cẩm nang sức khỏe răng miệng</h1><p>Bài viết chăm sóc răng miệng và kinh nghiệm dân gian có công thức cụ thể, kèm lưu ý an toàn.</p></div>'
            f'<div class="loc" role="group" aria-label="Lọc bài viết"><button data-loc="tat-ca" aria-pressed="true">Tất cả ({len(thu_tu)})</button><button data-loc="bai-viet" aria-pressed="false">Sức khỏe răng miệng ({sum(1 for s in thu_tu if bai[s]["nhom"]=="bai-viet")})</button><button data-loc="cam-nang" aria-pressed="false">Cẩm nang dân gian ({sum(1 for s in thu_tu if bai[s]["nhom"]=="cam-nang")})</button></div>'
            f'<div class="ds-bai-trang">{the}</div></div></main><div style="height:44px"></div>')


CC_F=os.path.join(ROOT,'content','cau-chuyen.json')
HOA='<svg class="cc-hoa" viewBox="0 0 150 24" aria-hidden="true"><path d="M2 12h52M96 12h52M75 3c-6 4-9 6-9 9s3 5 9 9c6-4 9-6 9-9s-3-5-9-9z" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="60" cy="12" r="2" fill="currentColor"/><circle cx="90" cy="12" r="2" fill="currentColor"/></svg>'
def trang_cc(A,HOME,BV):
    c=json.load(open(CC_F,encoding='utf-8'))
    out=[f'<section class="cc-hero"><img src="{A}img/ba-cu-que.jpg" alt="" fetchpriority="high"><div class="khung"><span class="cc-mat">Câu chuyện Quê ngoại</span><h1>{c["tieu_de"]}</h1>{HOA}<p>{c["phu_de"]}</p></div></section>',
         f'<div class="cc-giay"><div class="khung"><div class="cc-mo">{c["mo_dau_html"]}</div>']
    for i,ch in enumerate(c['chuong']):
        anh=ch.get('anh_goi_y') or 'bv-chum.jpg'
        out.append(f'<section class="cc-chuong{" dao" if i%2 else ""}"><div class="cc-anh"><img src="{A}img/{anh}" alt="" loading="lazy"></div><div class="cc-chu"><span class="cc-so">{ch.get("so","")}</span><h2>{ch["tieu_de"]}</h2>{ch["html"]}</div></section>')
        if ch.get('trich_dan'):
            out.append(f'</div></div><section class="cc-trich"><div class="khung"><blockquote>{ch["trich_dan"]}</blockquote></div></section><div class="cc-giay"><div class="khung">')
    out.append(f'<div class="cc-ket">{HOA}{c["ket_html"]}</div>')
    out.append(f'<div class="cc-cta"><img src="{A}img/bc-chum-doi.jpg" alt="Rượu cau Quê ngoại 350ml và Plus 500ml" loading="lazy"><div><h3>Rượu cau Quê ngoại</h3><p>Ngâm tại Nam Định theo công thức dân gian. Chỉ dùng trong khoang miệng: chấm hoặc ngậm 30–45 giây rồi nhổ bỏ. Không nuốt, không uống.</p><button class="nut-vang" data-xem="p350">Xem sản phẩm</button><a class="nut-vien-sang" href="{BV}index.html" style="justify-content:center">Đọc cẩm nang dân gian</a></div></div>')
    ng=''.join(f'<li><a href="{html.escape(n["url"])}" target="_blank" rel="noopener">{html.escape(n["ten"])}</a></li>' for n in c.get('nguon',[]))
    out.append('</div></div>')
    return '<main>'+''.join(out)+'</main>', c

def xuat(out,home_ten,artifact):
    if os.path.exists(out): shutil.rmtree(out)
    os.makedirs(out+'/assets'); os.makedirs(out+'/img'); os.makedirs(out+'/bai-viet')
    open(out+'/assets/site.css','w').write(css); open(out+'/assets/data.js','w').write(data_js)
    for j in ('site.js','home.js','bai.js'): shutil.copy(os.path.join(R,'assets',j),out+'/assets/'+j)
    for d in IMG_SRC:
        for f in os.listdir(d): shutil.copy(os.path.join(d,f),out+'/img/'+f)
    home_body=doc('pages/index.body.html')
    desc='Rượu cau Quê ngoại ngâm theo công thức dân gian tại Nam Định, hỗ trợ chăm sóc răng miệng tại chỗ. Chấm hoặc ngậm rồi nhổ bỏ, không nuốt.'
    if artifact:
        open(out+'/index.html','w').write(trang('Quê ngoại – Rượu cau',desc,home_body,'','#','','bai-viet/',['home.js'],doctype=False))
    open(out+'/'+home_ten,'w').write(trang('Quê ngoại – Rượu cau',desc,home_body,'','#','','bai-viet/',['home.js'],duong=''))
    HOME='../'+home_ten
    for s in thu_tu:
        d=bai[s]; body,extra=trang_bai(d,'../',HOME,'')
        open(f'{out}/bai-viet/{s}.html','w').write(trang(d['tieu_de']+' | Quê ngoại',d['meta'],body,'../',HOME,HOME,'',['bai.js'],extra,og_img=d['anh'],duong=f'bai-viet/{s}.html'))
    if os.path.exists(CC_F):
        body,c=trang_cc('',home_ten if not artifact else 'trang-chu.html','bai-viet/')
        open(out+'/cau-chuyen.html','w').write(trang(c['tieu_de']+' | Quê ngoại – Rượu cau',c['phu_de'],body,'',home_ten,home_ten,'bai-viet/',[],og_img='img/ba-cu-que.jpg',duong='cau-chuyen.html'))
    open(out+'/bai-viet/index.html','w').write(trang('Cẩm nang sức khỏe | Quê ngoại','Bài viết chăm sóc răng miệng và kinh nghiệm dân gian của Quê ngoại.',trang_ds('../',HOME,''),'../',HOME,HOME,'',['bai.js'],duong='bai-viet/'))

xuat(os.path.join(ROOT,'dist'),'index.html',False)
# Landing page 1 trang (kiểu LadiPage) tại /lp/
os.makedirs(os.path.join(ROOT,'dist','lp'),exist_ok=True)
_lp=doc('pages/lp.html').replace('{{SITE}}',SITE).replace('{{ROBOTS}}','<meta name="robots" content="noindex, nofollow">' if NHAP else f'<meta name="robots" content="index, follow, max-image-preview:large">\n<link rel="canonical" href="{SITE}lp/">\n<meta property="og:url" content="{SITE}lp/">')
open(os.path.join(ROOT,'dist','lp','index.html'),'w').write(_lp)
xuat(os.path.join(ROOT,'art'),'trang-chu.html',True)
print('ok',len(thu_tu),'bài')

# Bỏ ảnh không dùng
KEEP={'chai-350.webp','chai-500.webp','nen-combo-1.jpg','nen-combo-2.jpg','nen-combo-3.jpg','nen-combo-4.jpg'}
for out in [os.path.join(ROOT,'dist'),os.path.join(ROOT,'art')]:
    txt=''.join(open(f,encoding='utf-8').read() for f in glob.glob(out+'/**/*.html',recursive=True)+glob.glob(out+'/assets/*'))
    for i in os.listdir(out+'/img'):
        if i not in txt and i not in KEEP: os.remove(out+'/img/'+i)

# robots.txt + sitemap.xml
HOM_NAY=time.strftime('%Y-%m-%d')
urls=[('',HOM_NAY,'1.0'),('lp/',HOM_NAY,'0.9'),('cau-chuyen.html',NGAY_ISO,'0.6'),('bai-viet/',HOM_NAY,'0.8')]+[(f'bai-viet/{s}.html',bai[s].get('cap_nhat',bai[s].get('ngay',NGAY_ISO)),'0.7') for s in thu_tu]
sm='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'<url><loc>{SITE}{u}</loc><lastmod>{l}</lastmod><priority>{p}</priority></url>\n' for u,l,p in urls)+'</urlset>\n'
for out in [os.path.join(ROOT,'dist'),os.path.join(ROOT,'art')]:
    if NHAP: open(out+'/robots.txt','w').write('User-agent: *\nDisallow: /\n')
    else:
        open(out+'/robots.txt','w').write(f'User-agent: *\nAllow: /\n\nSitemap: {SITE}sitemap.xml\n')
        open(out+'/sitemap.xml','w').write(sm)
print('chế độ:','NHÁP (chặn Google)' if NHAP else 'CHÍNH THỨC → '+SITE)
