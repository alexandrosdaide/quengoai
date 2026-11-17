from PIL import Image, ImageFilter, ImageEnhance, ImageChops, ImageDraw
import sys
U='/mnt/user-data/uploads/Que-Ba-Bo-Nao/Anh-Web/'
M=U+'Minh-hoa-que-va-quy-trinh/'
A='/mnt/user-data/attachments/4c64857a-ab5f-5a0e-b374-2c7d5ad39e0e/'
CHAI={'350':U+'San-pham-chuan/chai-350ml-tach-nen-ban-nhap.png','500':U+'San-pham-chuan/chai-500ml-tach-nen-ban-nhap.png'}
_cache={}
def chai(k):
    if k not in _cache:
        im=Image.open(CHAI[k]).convert('RGBA'); im=im.crop(im.getbbox())
        W,H=im.size; px=im.load()
        for y in range(int(H*0.80),H):
            for x in range(W):
                r,g,b,a=px[x,y]
                if a and min(r,g,b)>150 and max(r,g,b)-min(r,g,b)<60: px[x,y]=(r,g,b,0)
        a=im.split()[3].filter(ImageFilter.MinFilter(3)); im.putalpha(a)
        im=im.crop(im.getbbox()); _cache[k]=im
    return _cache[k]
def dat(bg,k,cx,base,h,warm=(1.04,0.99,0.90),bright=1.0,shadow_dir=-1,shadow_len=0.35):
    W,H=bg.size
    b=chai(k); hh=int(H*h); ww=int(b.width*hh/b.height)
    b=b.resize((ww,hh),Image.LANCZOS)
    r,g,bb,a=b.split()
    r=r.point(lambda v:min(255,int(v*warm[0]*bright))); g=g.point(lambda v:min(255,int(v*warm[1]*bright))); bb=bb.point(lambda v:min(255,int(v*warm[2]*bright)))
    b=Image.merge('RGBA',(r,g,bb,a))
    x=int(W*cx-ww/2); y=int(H*base-hh)
    # cast shadow: squash alpha, skew, blur
    sh=Image.new('L',(W,H),0)
    sa=a.resize((ww,max(1,int(hh*shadow_len))))
    sh.paste(sa,(x+int(shadow_dir*ww*0.35),y+hh-int(hh*shadow_len*0.55)),sa)
    sh=sh.filter(ImageFilter.GaussianBlur(ww*0.08)).point(lambda v:int(v*0.45))
    # contact shadow ellipse
    ce=Image.new('L',(W,H),0); d=ImageDraw.Draw(ce)
    d.ellipse([x+ww*0.06,y+hh-ww*0.07,x+ww*0.94,y+hh+ww*0.07],fill=200)
    ce=ce.filter(ImageFilter.GaussianBlur(ww*0.05))
    sh=ImageChops.lighter(sh,ce)
    dark=Image.new('RGB',(W,H),(25,15,8))
    bg=Image.composite(dark,bg,sh)
    bg.paste(b,(x,y),b)
    return bg
def nen(p): return Image.open(p).convert('RGB')
SCENES={
 'chum-350':(M+'03-chum-su-gian-nha-moc.png',[('350',.50,.885,.40)]),
 'chum-500':(M+'03-chum-su-gian-nha-moc.png',[('500',.47,.89,.40)]),
 'hien-350':(M+'05-san-gach-hien-nha-que.png',[('350',.31,.88,.30)]),
 'cau-500':(M+'02-cau-can-canh.png',[('500',.70,.92,.62)]),
 'cau-doi':(M+'02-cau-can-canh.png',[('500',.62,.92,.60),('350',.82,.94,.58)]),
 'bonrua-350':(M+'08-boi-canh-bon-rua-buoi-sang.png',[('350',.535,.66,.30)]),
 'bonrua-500':(M+'08-boi-canh-bon-rua-buoi-sang.png',[('500',.53,.665,.29)]),
 'doitay-350':(M+'06-doi-tay-chon-hat-cau.png',[('350',.72,.80,.52)]),
 'quytrinh-500':(M+'07-quy-trinh-xep-cau-rot-ruou.png',[('500',.80,.86,.42)]),
}
if __name__=='__main__':
    out='/home/claude/queba-web/work/comp/'
    for name,(p,bs) in SCENES.items():
        bg=nen(p)
        for k,cx,base,h in bs: bg=dat(bg,k,cx,base,h)
        bg.save(out+name+'.jpg',quality=88)
    print('done')

SCENES2={
 'chum-doi':(M+'03-chum-su-gian-nha-moc.png',[('500',.40,.89,.40),('350',.51,.90,.38)]),
 'cau-4chai':(M+'02-cau-can-canh.png',[('350',.50,.90,.50),('350',.62,.91,.50),('350',.74,.92,.50),('350',.87,.94,.42)]),
}
def crop_ratio(im,cx,ratio,w_out,zoom=1.0,cy=0.5):
    W0,H0=im.size
    if zoom!=1.0:
        zw,zh=int(W0*zoom),int(H0*zoom); x0=int(min(max(cx*W0-zw/2,0),W0-zw)); y0=int(min(max(cy*H0-zh/2,0),H0-zh))
        im=im.crop((x0,y0,x0+zw,y0+zh)); cx=(cx*W0-x0)/zw
    W,H=im.size
    if W/H>ratio: cw=int(H*ratio); ch=H
    else: cw=W; ch=int(W/ratio)
    x=int(min(max(cx*W-cw/2,0),W-cw)); y=(H-ch)//2 if ch<H else 0
    return im.crop((x,y,x+cw,y+ch)).resize((w_out,int(w_out/ratio)),Image.LANCZOS)
def build_web(outdir):
    import os
    allsc=dict(SCENES); allsc.update(SCENES2)
    imgs={}
    for name,(p,bs) in allsc.items():
        bg=nen(p)
        for k,cx,base,h in bs: bg=dat(bg,k,cx,base,h)
        imgs[name]=(bg,sum(b[1] for b in bs)/len(bs))
    def sv(im,fn,q=78): im.save(outdir+fn,quality=q,optimize=True,progressive=True)
    # hero 4:3
    im,cx=imgs['bonrua-350']; sv(crop_ratio(im,cx,4/3,1200,zoom=0.62,cy=0.5),'hero-1.jpg')
    for fn,sc in [('hero-2.jpg','doitay-350'),('hero-3.jpg','cau-500'),('hero-4.jpg','quytrinh-500'),('hero-5.jpg','chum-doi')]:
        im,cx=imgs[sc]; sv(crop_ratio(im,cx,4/3,1200),fn)
    # squares
    for sc in ['bonrua-350','bonrua-500']:
        im,cx=imgs[sc]; sv(crop_ratio(im,cx,1,800,zoom=0.6,cy=0.55),'bc-'+sc+'.jpg')
    for sc in ['chum-350','chum-500','cau-500','doitay-350','quytrinh-500','cau-doi','chum-doi','hien-350']:
        im,cx=imgs[sc]; sv(crop_ratio(im,cx,1,800),'bc-'+sc+'.jpg')
    # banners 16:9
    im,cx=imgs['cau-4chai']; sv(crop_ratio(im,.68,16/9,1000),'banner-combo.jpg')
    im,cx=imgs['chum-350']; sv(crop_ratio(im,.5,4/5,800),'form-tu-van.jpg')
    # blurred combo backgrounds
    for i,p in enumerate([M+'03-chum-su-gian-nha-moc.png',M+'02-cau-can-canh.png',M+'05-san-gach-hien-nha-que.png',M+'08-boi-canh-bon-rua-buoi-sang.png']):
        im=crop_ratio(nen(p),.5,1,700).filter(ImageFilter.GaussianBlur(5))
        im=ImageEnhance.Brightness(im).enhance(0.55); sv(im,f'nen-combo-{i+1}.jpg',70)
    # article covers 16:9 from illustrations
    for fn,p in [('bv-nguyen-lieu.jpg',M+'01-nguyen-lieu-bay-phang.png'),('bv-quy-trinh.jpg',M+'07-quy-trinh-xep-cau-rot-ruou.png'),('bv-cau.jpg',M+'02-cau-can-canh.png'),('bv-chum.jpg',M+'03-chum-su-gian-nha-moc.png'),('bv-mieng-chum.jpg',A+'a2c021b9-H__g_m_ng_m_h_t_c_m_th_ch__m__p.png'),('bv-san-gach.jpg',M+'05-san-gach-hien-nha-que.png'),('bv-doi-tay.jpg',M+'06-doi-tay-chon-hat-cau.png'),('bv-bon-rua.jpg',M+'08-boi-canh-bon-rua-buoi-sang.png')]:
        sv(crop_ratio(nen(p),.5,16/9,1200),fn,74)
    for fn,sc in [('bv-bonrua-350.jpg','bonrua-350'),('bv-cau-doi.jpg','cau-doi'),('bv-chum-doi.jpg','chum-doi'),('bv-doitay-350.jpg','doitay-350')]:
        im,cx=imgs[sc]; sv(crop_ratio(im,cx,16/9,1200),fn,74)
