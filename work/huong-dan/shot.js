const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:420,height:800},deviceScaleFactor:3});
await p.goto('file://'+__dirname+'/hd.html');await p.waitForTimeout(400);const el=await p.$('#hd');await el.screenshot({path:__dirname+'/hd.png'});
const bb=await el.boundingBox();console.log(bb);await b.close()})()
