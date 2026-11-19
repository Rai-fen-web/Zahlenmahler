const C='zm-v1',ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!=='zm-share').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method==='POST'&&u.pathname.endsWith('/share-target')){
    e.respondWith((async()=>{const fd=await r.formData(),f=fd.get('image');
      if(f&&f.size){const c=await caches.open('zm-share');await c.put('shared',new Response(f,{headers:{'Content-Type':f.type||'image/jpeg','X-Name':encodeURIComponent(f.name||'Bild')}}))}
      return Response.redirect(new URL('./?shared=1',self.registration.scope).href,303)})());return}
  if(r.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r,{ignoreSearch:true})))});
