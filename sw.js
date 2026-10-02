const C='asistencia-v12',F=['index.html','manifest.webmanifest','icon-192.png','icon-512.png','lib/jsQR.js','lib/qrcode.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>{if(!r.ok)throw new Error(u);return c.put(u,r)})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!='GET'||new URL(q.url).origin!=location.origin)return;
if(q.mode=='navigate'){e.respondWith((async()=>{const c=await caches.open(C),old=await c.match('index.html');
const net=fetch(q.url,{cache:'no-cache'}).then(r=>{if(r.ok)c.put('index.html',r.clone());return r});e.waitUntil(net.catch(()=>{}));
if(!old)return net.catch(()=>new Response('Sin conexion',{status:503}));
return Promise.race([net.then(r=>r.ok?r:old),new Promise(res=>setTimeout(()=>res(old),3000))]).catch(()=>old)})());return}
e.respondWith(caches.match(q,{ignoreSearch:true}).then(r=>r||fetch(q)))});
