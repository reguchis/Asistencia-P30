/* 2.0.30: lo que la app pide «sin copia» (revisar si hay versión nueva) va directo a internet.
   2.0.24: al activarse borra SOLO sus propias copias viejas (asistencia-app-…); nunca las de la versión beta, que vive en el mismo sitio */
const C='asistencia-app-2.0.58',F=['index.html','manifest.webmanifest','icon-192.png','icon-512.png','lib/jsQR.js','lib/qrcode.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>{if(!r.ok)throw new Error(u);return c.put(u,r)})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C&&x.startsWith('asistencia-app-')).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!='GET'||new URL(q.url).origin!=location.origin)return;if(q.cache=='no-store')return;
if(q.mode=='navigate'){const p=new URL(q.url).pathname,b=new URL('./',self.registration.scope).pathname;if(p!=b&&p!=b+'index.html')return;e.respondWith((async()=>{const c=await caches.open(C),old=await c.match('index.html');
const net=fetch(q.url,{cache:'no-cache'}).then(r=>r.ok&&/text\/html/.test(r.headers.get('content-type')||'')?c.put('index.html',r.clone()).then(()=>r):r);
if(old){e.waitUntil(net.catch(()=>{}));return old}
return net.catch(()=>new Response('Sin conexion',{status:503}))})());return}
e.respondWith(caches.match(q,{ignoreSearch:true}).then(r=>r||fetch(q)))});
